import os
import uuid
import logging
import sys

# Add parent dir to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import TEMP_AUDIO_DIR
from video.validate_video import validate_video
from video.id_card_yolo import detect_id_card
from audio.extract_audio import extract_audio
from llm.analyze_audio import analyze_audio_content

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_video_pipeline(video_path: str) -> dict:
    """
    Orchestrates the full video analysis pipeline.
    """
    audio_path = None
    
    result = {
        "video_valid": False,
        "id_card_present": False,
        "id_card_confidence": 0.0,
        "audio_score": 0,
        "final_score": 0,
        "error": None
    }

    try:
        logger.info(f"Starting pipeline for: {video_path}")

        # 1. Validation
        if not os.path.exists(video_path):
            raise FileNotFoundError("Video file not found.")
            
        validate_video(video_path)
        result["video_valid"] = True
        logger.info("Video validation passed.")

        # 2. ID Card Detection
        yolo_result = detect_id_card(video_path)
        result["id_card_present"] = yolo_result["id_card_present"]
        result["id_card_confidence"] = yolo_result["id_card_confidence"]
        logger.info(f"YOLO ID Check: {yolo_result}")

        # 3. Audio Extraction
        # Generate a unique temp filename for audio
        audio_filename = f"{uuid.uuid4()}.wav"
        audio_path = os.path.join(TEMP_AUDIO_DIR, audio_filename)
        
        extract_audio(video_path, audio_path)
        logger.info(f"Audio extracted to: {audio_path}")
        
        # 4. LLM Analysis
        analysis_result = analyze_audio_content(audio_path)
        result["audio_score"] = analysis_result["audio_score"]
        result["final_score"] = analysis_result["final_score"]
        result["transcript"] = analysis_result.get("transcript", "")
        logger.info(f"LLM Analysis: {analysis_result}")

    except Exception as e:
        logger.error(f"Pipeline error: {e}")
        result["error"] = str(e)
    
    finally:
        # 5. Cleanup (Statelessness Guarantee)
        # Delete video
        if os.path.exists(video_path):
            try:
                os.remove(video_path)
                logger.info(f"Deleted temp video: {video_path}")
            except Exception as e:
                logger.error(f"Failed to delete video {video_path}: {e}")
        
        # Delete audio
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                logger.info(f"Deleted temp audio: {audio_path}")
            except Exception as e:
                logger.error(f"Failed to delete audio {audio_path}: {e}")

    return result
