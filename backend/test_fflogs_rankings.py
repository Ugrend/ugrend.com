import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from lib.fflogs_config import fflogs_config_manager
from loguru import logger

def test_fflogs_ranking_flow():
    logger.info("Starting FFLogs Ranking Flow Test")
    
    # 1. Update Zones (checks if refactor works)
    logger.info("Invoking update_zones...")
    fflogs_config_manager.update_zones()
    
    # 2. Add a dummy character if none exists for testing purposes
    # We won't modify the file if we can avoid it, but if characters is empty we can't test fetching.
    # Let's check config first.
    if not fflogs_config_manager.config or not fflogs_config_manager.config.characters:
        logger.warning("No characters in config. Test will not fetch rankings. Please add a character to fflogs_config.json")
    else:
        # 3. Get Rankings
        logger.info("Invoking get_rankings...")
        rankings = fflogs_config_manager.get_rankings()
        
        logger.info(f"Rankings fetched for {len(rankings)} characters.")
        for char_key, zone_data in rankings.items():
            logger.info(f"Character: {char_key}")
            for zone_key, data in zone_data.items():
                logger.info(f"  Zone {zone_key}: Difficulty {data.difficulty}, ZoneID {data.zone}, Rankings Count: {len(data.rankings)}")
                if data.rankings:
                    # Print first ranking details to verify parsing
                    r = data.rankings[0]
                    logger.info(f"    Sample Ranking: {r.encounter.name} - {r.rankPercent}%")

    logger.info("Test Complete")

if __name__ == "__main__":
    test_fflogs_ranking_flow()
