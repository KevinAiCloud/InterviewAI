from moviepy.editor import VideoFileClip
import os

def extract_audio(video_path: str, output_path: str) -> str:
    """
    Extracts audio from video and saves it to output_path.
    Returns the path to the extracted audio file.
    """
    try:
        if os.path.exists(output_path):
            os.remove(output_path)
            
        with VideoFileClip(video_path) as video:
            if video.audio is None:
                raise ValueError("Video has no audio track.")
            
            video.audio.write_audiofile(output_path, verbose=False, logger=None)
            
        return output_path
    except Exception as e:
        raise RuntimeError(f"Failed to extract audio: {e}")
