
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from contextlib import asynccontextmanager
from views.base import api_router
from lib.fflogs_config import fflogs_config_manager
from settings import IMG_DIR, FRONTEND_DIR

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    fflogs_config_manager.load_config()
    # update_zones does network IO, so we might want to do it somewhat asynchronously or just call it.
    # Since it is synchronous logic using httpx (I used Client() so it's sync), it will block startup.
    # User requested "When the application starts up it should make the following request".
    # Sync is fine for now/simple implementation.
    fflogs_config_manager.update_zones()
    fflogs_config_manager.fetch_and_store_rankings()
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

app.include_router(api_router)


if os.path.exists(FRONTEND_DIR):
    app.mount("/assets/imgs/", StaticFiles(directory=IMG_DIR), name="imgs")
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Serve index.html for any path not matched by API or static files
        # This supports client-side routing
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": "Frontend not built or not found at ../frontend/dist"}
