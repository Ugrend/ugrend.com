from typing import List, Optional
from pydantic import BaseModel

class FFLogsTokenResponse(BaseModel):
    token_type: str
    expires_in: int
    access_token: str
    expires: str | None = None

class Character(BaseModel):
    name: str
    server: str
    region: str

class Zone(BaseModel):
    zone_id: int
    name: str

class FFLogsConfig(BaseModel):
    characters: List[Character]
    savage_zones: List[Zone]
    ultimate_zones: List[Zone]

class Encounter(BaseModel):
    id: int
    name: str

class AllStars(BaseModel):
    rank: int
    regionRank: int
    serverRank: int
    rankPercent: str | float
    total: int

class Ranking(BaseModel):
    encounter: Encounter
    rankPercent: float | None
    medianPercent: float | None
    lockedIn: bool
    totalKills: int
    fastestKill: int
    allStars: Optional[AllStars] = None
    spec: str | None

class ZoneRankingData(BaseModel):
    name: str # Added name field as requested
    difficulty: int
    zone: int
    rankings: List[Ranking]
 

class CharacterData(BaseModel):
    # Dynamic keys like "zone_68" will be handled by looking at the model fields or using a dict wrapper if needed.
    # However, since the user wants specific access, we might just store the dict inside the manager
    # but for type safety we can define a generic container or use Dict.
    # The user asked for "zone_x: zoneRankings" structure.
    # We will represent the dynamic structure using a Dict for the zone keys in the manager,
    # or we can use a root validator if we really want to fit it into a model, but a Dict is cleaner for dynamic keys.
    pass

