from settings import IMG_DIR
import json
import os
from typing import List, Optional, Dict
import httpx
from datetime import datetime, timedelta
from loguru import logger
from models.fflogs import FFLogsConfig, Zone, Character, ZoneRankingData
from pydantic import BaseModel
from lib.dependencies import get_token, FF_LOGS_CLIENT_URI

CONFIG_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fflogs_config.json")
CACHED_FFLOGS_DATA = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cached_data.json")

def post_fflogs_graphql(query: str, token: str) -> dict:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    with httpx.Client() as client:
        response = client.post(FF_LOGS_CLIENT_URI, json={"query": query}, headers=headers)
        response.raise_for_status()
        return response.json()


def pydantic_encoder(obj):
    if isinstance(obj, BaseModel):
        return obj.model_dump()
    return NotImplemented

class FFLogsConfigManager:
    def __init__(self, config_path: str = CONFIG_FILE_PATH):
        self.config_path = config_path
        self.config: Optional[FFLogsConfig] = None
        self.ranking_data: Dict[str, Dict[str, ZoneRankingData]] = {}
        self.last_ranking_fetch_time: Optional[datetime] = None

    def load_config(self) -> FFLogsConfig:
        if not os.path.exists(self.config_path):
            logger.info(f"Config file not found at {self.config_path}, creating default.")
            default_config = FFLogsConfig(characters=[], savage_zones=[], ultimate_zones=[])
            self.config = default_config
            self.save_config()
            return self.config
        
        try:
            with open(self.config_path, "r") as f:
                data = json.load(f)
            self.config = FFLogsConfig(**data)
            logger.info("FFLogs config loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load config: {e}. Overwriting with default.")
            self.config = FFLogsConfig(characters=[], savage_zones=[], ultimate_zones=[])
            self.save_config()
            
        return self.config

    def save_config(self):
        if self.config:
            with open(self.config_path, "w") as f:
                f.write(self.config.model_dump_json(indent=2))
            logger.info("FFLogs config saved.")

    def update_zones(self):
        logger.info("Updating FFLogs zones...")
        try:
            token = get_token().access_token
        except Exception as e:
            logger.error(f"Could not get token for zone update: {e}")
            return

        query = """query {
  worldData {
    zones(expansion_id: 5) {
      id
      difficulties {
        id
        name
        sizes
      }
      encounters {
        id
        name
        zone {
          id
          name
        }
      }
      expansion {
        id
        name
      }
      frozen
      name
    }
  }
}"""
        
        try:
            data = post_fflogs_graphql(query, token)
            
            zones_data = data.get("data", {}).get("worldData", {}).get("zones", [])
            new_savage_zones_to_add: List[Zone] = []
            
            # Ensure config is loaded
            if self.config is None:
                self.load_config()
            
            # Create a set of existing zone IDs for fast lookup
            current_zone_ids = {z.zone_id for z in self.config.savage_zones}
            
            for zone_data in zones_data:
                # Check for difficulty 101 AND size 8
                difficulties = zone_data.get("difficulties", [])
                has_savage = any(d.get("id") == 101 and 8 in d.get("sizes", []) for d in difficulties)
                
                if has_savage:
                    z_id = zone_data.get("id")
                    z_name = zone_data.get("name")
                    
                    if z_id not in current_zone_ids:
                        new_savage_zones_to_add.append(Zone(zone_id=z_id, name=z_name))
            
            if new_savage_zones_to_add:
                logger.info(f"Found {len(new_savage_zones_to_add)} new savage zones. Updating config.")
                # Prepend new zones to the existing list
                self.config.savage_zones = new_savage_zones_to_add + self.config.savage_zones
                self.save_config()
            else:
                logger.info("No new savage zones found.")

        except Exception as e:
            logger.error(f"Error updating zones: {e}")

    def generate_ranking_query(self) -> str:
        if not self.config or not self.config.characters:
            return ""

        query_parts = ["query {"]
        
        for char in self.config.characters:
            # Create a unique alias key for the character
            char_key = f"{char.name.replace(' ', '_')}_{char.server}_{char.region}"
            
            query_parts.append(f'{char_key}: characterData {{')
            query_parts.append(f'    character(name: "{char.name}", serverSlug: "{char.server}", serverRegion: "{char.region}") {{')
            
            # Add Savage Zones (difficulty 101)
            for zone in self.config.savage_zones:
                query_parts.append(f'      zone_{zone.zone_id}: zoneRankings(zoneID: {zone.zone_id}, difficulty: 101, metric: rdps, timeframe: Historical)')
            
            # Add Ultimate Zones (difficulty 100)
            for zone in self.config.ultimate_zones:
                 query_parts.append(f'      zone_{zone.zone_id}: zoneRankings(zoneID: {zone.zone_id}, difficulty: 100, metric: rdps, timeframe: Historical)')
            
            query_parts.append('    }')
            query_parts.append('  }')
            
        query_parts.append('}')
        return "\n".join(query_parts)

    def fetch_and_store_rankings(self):
        logger.info("Fetching FFLogs rankings...")
        if self.config is None:
            self.load_config()
            
        if not self.config.characters:
            logger.info("No characters configured. Skipping ranking fetch.")
            return

        query = self.generate_ranking_query()
        if not query:
            return

        try:
            token = get_token().access_token
            data = post_fflogs_graphql(query, token)
            
            response_data = data.get("data", {})
            new_ranking_data: Dict[str, Dict[str, ZoneRankingData]] = {}
            
            for char_key, char_data_wrapper in response_data.items():
                if not char_data_wrapper: 
                    continue
                    
                character_container = char_data_wrapper.get("character")
                if not character_container:
                    continue
                
                char_zones_data: Dict[str, ZoneRankingData] = {}
                for key, val in character_container.items():
                    if key.startswith("zone_") and val:
                        try:
                            # Infer zone_id from key
                            z_id = int(key.split("_")[1])
                            
                            # Infer difficulty based on config
                            difficulty = 101 # Default to savage
                            zone_name = "Unknown Zone"
                            
                            # Find zone name in savage zones
                            savage_match = next((z for z in self.config.savage_zones if z.zone_id == z_id), None)
                            if savage_match:
                                zone_name = savage_match.name
                            
                            # Check if it's in ultimate zones
                            ultimate_match = next((z for z in self.config.ultimate_zones if z.zone_id == z_id), None)
                            if ultimate_match:
                                difficulty = 100
                                zone_name = ultimate_match.name
                            
                            # 'val' should contain 'rankings' list due to our query structure
                            # Construct the ZoneRankingData object. Pydantic will handle sub-model validation.
                            zone_ranking_data = ZoneRankingData(
                                name=zone_name,
                                difficulty=difficulty,
                                zone=z_id,
                                rankings=val.get("rankings", [])
                            )
                            char_zones_data[key] = zone_ranking_data
                            
                            # Download icons for encounters
                            for ranking in zone_ranking_data.rankings:
                                self.ensure_encounter_icon(ranking.encounter.id)
                            
                        except Exception as e:
                            logger.error(f"Error parsing zone data for {key}: {e}")
                            continue
                
                new_ranking_data[char_key] = char_zones_data
            
            self.ranking_data = new_ranking_data
            self.last_ranking_fetch_time = datetime.now()
            with open(CACHED_FFLOGS_DATA, "w") as f:
                f.write(json.dumps(new_ranking_data, default=pydantic_encoder))
            logger.info(f"Updated rankings for {len(new_ranking_data)} characters.")

        except Exception as e:
             logger.error(f"Error fetching rankings: {e}")
             # We do not raise here to prevent crashing the app loop, but we could if critical.

    def ensure_encounter_icon(self, encounter_id: int):
        if not os.path.exists(IMG_DIR):
            try:
                os.makedirs(IMG_DIR, exist_ok=True)
            except Exception as e:
                logger.error(f"Could not create image directory {IMG_DIR}: {e}")
                return
        img_path = os.path.join(IMG_DIR, f"{encounter_id}-icon.jpg")
        if not os.path.exists(img_path):
            url = f"https://assets.rpglogs.com/img/ff/bosses/{encounter_id}-icon.jpg"
            try:
                with httpx.Client() as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        with open(img_path, "wb") as f:
                            f.write(resp.content)
                        logger.info(f"Downloaded icon for encounter {encounter_id}")
                    else:
                        logger.warning(f"Failed to download icon for encounter {encounter_id}: Status {resp.status_code}")
            except Exception as e:
                logger.error(f"Error downloading icon for encounter {encounter_id}: {e}")


    def get_rankings(self) -> Dict[str, Dict[str, ZoneRankingData]]:
        now = datetime.now()
        should_refresh = False
        
        if self.last_ranking_fetch_time is None:
            should_refresh = True
        elif now - self.last_ranking_fetch_time > timedelta(hours=1):
            should_refresh = True
            
        if should_refresh:
            self.fetch_and_store_rankings()
        if self.ranking_data is None and os.path.exists(CACHED_FFLOGS_DATA):
            with open(CACHED_FFLOGS_DATA, "r") as f:
                self.ranking_data = json.load(f)
        return self.ranking_data

# Global instance
fflogs_config_manager = FFLogsConfigManager()
