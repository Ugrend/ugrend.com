import os
from typing import Annotated, Dict, Optional
from datetime import datetime, timedelta
import httpx
from fastapi import Depends
from loguru import logger
from dotenv import load_dotenv

from models.fflogs import FFLogsTokenResponse

load_dotenv()

# Constants
FF_LOGS_CLIENT_URI = "https://www.fflogs.com/api/v2/client"
FF_LOGS_TOKEN_URI = "https://www.fflogs.com/oauth/token"

# Environment Variables
FF_LOGS_CLIENT = os.getenv("FF_LOGS_CLIENT")
FF_LOGS_SECRET = os.getenv("FF_LOGS_SECRET")

# Global Token State
_CURRENT_TOKEN: Dict[FFLogsTokenResponse | None, Optional[str | datetime]] = {"token": None, "expires": None}


def refresh_token() -> FFLogsTokenResponse:
    """
    Refreshes the FFLogs OAuth token.
    Throws an exception if the request fails.
    """
    if not FF_LOGS_CLIENT or not FF_LOGS_SECRET:
        raise ValueError("FF_LOGS_CLIENT and FF_LOGS_SECRET must be set in environment variables.")

    payload = {
        "grant_type": "client_credentials",
        "client_id": FF_LOGS_CLIENT,
        "client_secret": FF_LOGS_SECRET
    }
    
    headers = {"Content-Type": "application/json"}
    logger.info("requesting new fflogs token...")
    try:
        response = httpx.post(FF_LOGS_TOKEN_URI, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        logger.success("successfully obtained new fflogs token")
        return FFLogsTokenResponse(**data)
        
    except httpx.HTTPStatusError as e:
        logger.error(f"failed to refresh token: {e.response.text}")
        raise e
    except Exception as e:
        logger.error(f"error refreshing token: {e}")
        raise e


def get_token() -> FFLogsTokenResponse:
    """
    Retrieves a valid FFLogs access token.
    Refreshes if expired or close to expiry (within 5 minutes).
    """
    global _CURRENT_TOKEN
    
    current_token = _CURRENT_TOKEN.get("token")
    expires_at = _CURRENT_TOKEN.get("expires")
    
    now = datetime.now()
    
    # Check if we need to refresh
    should_refresh = False
    
    if current_token is None or expires_at is None:
        should_refresh = True
    elif isinstance(expires_at, datetime):
        # Check if expired or within 5 minutes of expiring
        if now > (expires_at - timedelta(minutes=5)):
            should_refresh = True
            logger.info("token is expired or close to expiry, refreshing...")
    
    if should_refresh:
        token_data = refresh_token()
        
        # Calculate expiry time
        # token_data.expires_in is in seconds (standard OAuth), but user said milliseconds?
        # User said: "token.expires_in is in miliseconds."
        # I will follow user instructions strictly: milliseconds.
        expiry_delta = timedelta(milliseconds=token_data.expires_in)
        new_expiry = now + expiry_delta
        
        _CURRENT_TOKEN["token"] = token_data
        _CURRENT_TOKEN["expires"] = new_expiry
        
        return token_data
        
    if isinstance(current_token, FFLogsTokenResponse):
        return current_token
    raise ValueError("Failed to retrieve token")


# Dependency
FFLogsToken = Annotated[FFLogsTokenResponse, Depends(get_token)]
