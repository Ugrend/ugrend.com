from fastapi import APIRouter, Depends
from lib.dependencies import FFLogsToken
from loguru import logger

router = APIRouter(prefix="/fflogs", tags=["fflogs"])

@router.get("/")
async def get_fflogs_data(token: FFLogsToken):
    """
    Example endpoint that requires a valid FFLogs token.
    The token is automatically handled by the dependency.
    """
    logger.info("Hello World!")
    return token
