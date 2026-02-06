import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")

# Temporary Directories
TEMP_VIDEO_DIR = BASE_DIR / "temp" / "video"
TEMP_AUDIO_DIR = BASE_DIR / "temp" / "audio"

# Ensure temp directories exist
TEMP_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
TEMP_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Constraints
MAX_VIDEO_DURATION = 60  # seconds
ALLOWED_EXTENSIONS = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}

# Paths
# Using standard YOLOv8n model, will be downloaded automatically by ultralytics if not present
YOLO_MODEL_PATH = "yolov8n.pt" 

# API Keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Processing Settings
ID_CARD_CONFIDENCE_THRESHOLD = 0.3
FRAME_SAMPLE_RATE = 10  # Process every 10th frame for speed
