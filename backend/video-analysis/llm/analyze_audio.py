import os
import json
from openai import OpenAI
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import OPENAI_API_KEY

def analyze_audio_content(audio_path: str) -> dict:
    """
    Transcribes audio and analyzes it using LLM.
    """
    if not OPENAI_API_KEY:
        print("Warning: No OPENAI_API_KEY found. Returning mock analysis.")
        return {"audio_score": 0, "final_score": 0}

    # Setup clients
    is_openrouter = OPENAI_API_KEY.startswith("sk-or-v1")
    
    # LLM Client (for Analysis)
    if is_openrouter:
        llm_client = OpenAI(
            api_key=OPENAI_API_KEY, 
            base_url="https://openrouter.ai/api/v1"
        )
        llm_model = "x-ai/grok-4.1-fast" # User requested model
    else:
        llm_client = OpenAI(api_key=OPENAI_API_KEY)
        llm_model = "gpt-4o"

    # 1. Transcribe
    transcript_text = ""
    
    # Try OpenAI Whisper if NOT OpenRouter (or if we had a separate key, but here we assume one key)
    if not is_openrouter:
        try:
            with open(audio_path, "rb") as audio_file:
                transcript_response = llm_client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file
                )
            transcript_text = transcript_response.text
        except Exception as e:
            print(f"OpenAI Transcription failed: {e}")

    # Fallback to SpeechRecognition (Google Web Speech API) if OpenAI skipped or failed
    if not transcript_text:
        try:
            import speech_recognition as sr
            r = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio_data = r.record(source)
                transcript_text = r.recognize_google(audio_data)
                print(f"DEBUG: Transcription successful via Google Web Speech: {transcript_text[:50]}...")
        except ImportError:
            print("SpeechRecognition not installed. Install with: pip install SpeechRecognition")
        except Exception as e:
            print(f"Fallback Transcription failed: {e}")

    if not transcript_text:
        print("Warning: Could not transcribe audio. Using mock text for testing.")
        transcript_text = "I am very interested in this position because I have the required skills."

    # 2. Analyze with LLM
    prompt = f"""
    You are a strict professional Interview Evaluator.
    Analyze the following candidate response from a video interview.
    
    Transcript: "{transcript_text}"
    
    Evaluation Criteria:
    1. Communication Quality ('audio_score'): Clarity, fluency, professional tone.
    2. Content Relevancy ('final_score'): Depth of answer, relevance to interview context, completeness.
    
    STRICT SCORING RULES:
    - If the transcript is under 20 words, give a FAILING SCORE (0-2) regardless of content.
    - If the answer is just a greeting or introduction (e.g., "Hi my name is..."), score MAX 1.
    - If the answer is vague or lacks substance, score below 4.
    - A score of 8-10 is reserved ONLY for exceptional, comprehensive, and relevant answers.
    
    Return ONLY a valid JSON object:
    {{
        "audio_score": int,
        "final_score": int
    }}
    """

    try:
        response = llm_client.chat.completions.create(
            model=llm_model,
            messages=[
                {"role": "system", "content": "You are a critical interview evaluator. Output strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        result = json.loads(content)
        return {
            "transcript": transcript_text,
            "audio_score": result.get("audio_score", 0),
            "final_score": result.get("final_score", 0)
        }
    except Exception as e:
        print(f"LLM analysis failed: {e}")
        return {
            "transcript": transcript_text or "Analysis Failed",
            "audio_score": 0, 
            "final_score": 0
        }
