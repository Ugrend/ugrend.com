from pydantic import BaseModel
from datetime import datetime 
class Screenshot(BaseModel):
    filename: str
    title: str
    extra: str
    date: datetime