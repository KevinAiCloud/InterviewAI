import sys
import os

# Add parent dir to sys.path to resolve generic imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import uuid
import logging
from config import TEMP_VIDEO_DIR, ALLOWED_EXTENSIONS
from pipeline.process_video import process_video_pipeline

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

app = FastAPI(title="Video Analysis Service")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-video")
async def analyze_video_endpoint(file: UploadFile = File(...)):
    """
    Endpoint to upload and analyze an interview video.
    Returns: JSON with validity, ID card check, and scores.
    """
    
    # Basic extension check before saving
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}")

    # Generate unique filename
    temp_filename = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(TEMP_VIDEO_DIR, temp_filename)

    try:
        # Save file chunks to temp storage
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Video saved to {temp_path}")
        
        # Run Pipeline
        result = process_video_pipeline(temp_path)
        
        # If result["error"] is present, we still return the structure but might want to log it
        if result.get("error"):
            logger.warning(f"Pipeline reported error: {result['error']}")

        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"API Error: {e}")
        # Ensure cleanup if save failed midway
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
