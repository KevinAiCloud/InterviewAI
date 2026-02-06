from ultralytics import YOLO
import cv2
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import YOLO_MODEL_PATH, ID_CARD_CONFIDENCE_THRESHOLD, FRAME_SAMPLE_RATE

def detect_id_card(video_path: str) -> dict:
    """
    Detects ID card presence in a video using YOLO.
    """
    model = YOLO(YOLO_MODEL_PATH)
    
    # Classes: 67 (cell phone), 73 (book), 27 (tie - proxy for lanyard)
    TARGET_CLASSES = [67, 73, 27] 

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {video_path}")

    max_conf = 0.0
    id_card_detected = False
    
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % FRAME_SAMPLE_RATE != 0:
                continue

            results = model(frame, verbose=False)
            
            for result in results:
                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    if cls_id in TARGET_CLASSES:
                        if conf > max_conf:
                            max_conf = conf
                        
                        if conf >= ID_CARD_CONFIDENCE_THRESHOLD:
                            id_card_detected = True
                            print(f"DEBUG: ID Card Candidate Detected! Class: {cls_id}, Conf: {conf}")

                if box.conf[0] > 0.3:
                    print(f"DEBUG: Frame {frame_count} - Detected: {int(box.cls[0])} ({float(box.conf[0]):.2f})")

                            
    finally:
        cap.release()

    return {
        "id_card_present": id_card_detected,
        "id_card_confidence": max_conf
    }
