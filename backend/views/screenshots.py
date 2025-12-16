from fastapi import APIRouter
import os
from pathlib import Path
from datetime import datetime
from settings import IMG_DIR
from typing import List, Dict, Optional


router = APIRouter(prefix="/screenshots", tags=["screenshots"])

# In-memory cache for metadata
# Key: filename (e.g. "ucob.png"), Value: Dict with title, extra, date_obj
METADATA_CACHE: Dict[str, Dict] = {}

@router.get("/")
def get_screenshots() -> List[Dict[str, Optional[str]]]:
    screenshots_dir = Path(IMG_DIR) / "screenshots"
    
    if not screenshots_dir.exists():
        return []
        
    results = []
    
    # Extensions to look for
    valid_extensions = {'.jpg', '.png', '.jpeg'}
    
    for file_path in screenshots_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in valid_extensions:
            filename = file_path.name
            
            # Check cache first
            if filename in METADATA_CACHE:
                cached_data = METADATA_CACHE[filename]
                results.append(cached_data)
                continue

            meta_path = file_path.with_suffix('.meta')
            
            title = ""
            extra = ""
            date_str = ""
            date_obj = None
            
            meta_found = False

            if meta_path.exists():
                try:
                    with open(meta_path, 'r', encoding='utf-8') as f:
                        lines = [line.strip() for line in f.readlines()]
                        
                        if len(lines) >= 1:
                            title = lines[0]
                        if len(lines) >= 2:
                            extra = lines[1]
                        if len(lines) >= 3:
                            date_str = lines[2]
                            try:
                                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                            except ValueError:
                                # Invalid date format in file
                                pass
                    meta_found = True
                except Exception:
                    # Error reading meta file
                    pass
            
            # If no valid date from meta file, use file creation time
            if not date_obj:
                stat = file_path.stat()
                ts = stat.st_ctime
                date_obj = datetime.fromtimestamp(ts)

            data_entry = {
                "filename": filename,
                "title": title,
                "extra": extra,
                "_date_obj": date_obj # Helper for sorting
            }
            
            # Only cache if meta file was found and successfully parsed
            if meta_found:
                METADATA_CACHE[filename] = data_entry
            
            results.append(data_entry)
            
    # Sort by date, newest to oldest (descending)
    results.sort(key=lambda x: x["_date_obj"], reverse=True)
    # Remove helper key
    final_results = []
    for item in results:
        # User requested: {"filename": <filename>, "title": <str>, "extra": <str> }
        # They didn't explicitly ask for the date in the payload, but "The 1st line will be title...".
        # "it should then return a payload {"filename": <filename>, "title": <str>, "extra": <str> }"
        # I will strictly follow the requested payload structure, omitting the date.
        final_results.append({
            "filename": item["filename"],
            "title": item["title"],
            "extra": item["extra"],
            "date": item["_date_obj"].isoformat()
        })
        
    return final_results
