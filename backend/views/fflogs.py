from fastapi import APIRouter, Depends
from lib.dependencies import FFLogsToken
from loguru import logger
from lib.fflogs_config import fflogs_config_manager
from typing import Dict
from lib.fflogs_config import ZoneRankingData

router = APIRouter(prefix="/fflogs", tags=["fflogs"])

@router.get("/")
async def get_fflogs_data() -> Dict[str, Dict[str, ZoneRankingData]]:
    """
    Example endpoint that requires a valid FFLogs token.
    The token is automatically handled by the dependency.
    """
    return fflogs_config_manager.get_rankings()
