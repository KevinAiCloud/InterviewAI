from moviepy.editor import VideoFileClip
import os
from pathlib import Path
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import MAX_VIDEO_DURATION, ALLOWED_EXTENSIONS

def validate_video(file_path: str) -> bool:
    """
    Validates video duration and format.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Video file not found: {file_path}")

    # Check extension
    ext = Path(file_path).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Invalid file format: {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    # Check duration
    try:
        with VideoFileClip(file_path) as clip:
            duration = clip.duration
            if duration > MAX_VIDEO_DURATION:
                raise ValueError(f"Video duration ({duration:.2f}s) exceeds limit ({MAX_VIDEO_DURATION}s).")
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise RuntimeError(f"Failed to process video file: {e}")

    return True
