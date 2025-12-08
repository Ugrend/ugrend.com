from pydantic import BaseModel

class FFLogsTokenResponse(BaseModel):
    token_type: str
    expires_in: int
    access_token: str
    expires: str | None = None
