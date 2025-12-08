from fastapi import APIRouter
from views import fflogs

api_router = APIRouter(prefix="/api")

api_router.include_router(fflogs.router)

@api_router.get("/health")
async def health_check():
    return {"status": "ok"}
