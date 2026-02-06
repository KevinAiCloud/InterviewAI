import os
import json
import logging
from dotenv import load_dotenv
import requests
from pydantic import BaseModel, Field
from typing import List, Literal, Optional

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("llm")

from config import DEFAULT_TOPIC, QUESTION_COUNT

def generate_questions(description: Optional[str] = None):
    """
    Generates MCQs based on the provided job description or topic.
    Returns: A dictionary with a 'questions' key containing the list of questions.
    """
    
    topic = description.strip() if description and description.strip() else DEFAULT_TOPIC
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables.")

    # Initialize requests payload
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://interviewai.local", # OpenRouter best practice
        "X-Title": "InterviewAI"
    }

    system_prompt = (
        f"You are an expert technical interviewer. Create a technical assessment for the following role/domain: '{topic}'.\n"
        f"You must generate exactly {QUESTION_COUNT} Multiple Choice Questions (MCQs).\n"
        "Rules:\n"
        "1. Difficulty: Medium (suitable for students/juniors).\n"
        "2. Each question must have 4 options.\n"
        "3. Indicate the correct answer explicitly (A, B, C, or D).\n"
        "4. Output strictly valid JSON matching the requested format.\n"
        "5. Do NOT hallucinate. Ensure questions are technically accurate.\n"
        "\n"
        "Required JSON Format:\n"
        "{\n"
        '  "questions": [\n'
        '    {\n'
        '      "question": "text",\n'
        '      "options": ["A", "B", "C", "D"],\n'
        '      "answer": "Option Label (e.g. A)"\n'
        '    }\n'
        '  ]\n'
        "}"
    )

    data = {
        "model": "x-ai/grok-4.1-fast",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Generate the assessment now."}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3
    }

    logger.info(f"Generating questions for topic: {topic}")

    try:
        import requests
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30 # Add timeout to prevent infinite hanging
        )
        
        response.raise_for_status()
        result_json = response.json()
        
        content = result_json["choices"][0]["message"]["content"].strip()
        
        # Parse logic
        try:
            parsed_response = json.loads(content)
            
            # Simple validation
            if "questions" not in parsed_response:
                raise ValueError("JSON does not contain 'questions' key")
                
            return parsed_response

        except json.JSONDecodeError:
            logger.error(f"JSON Decode Error. Content: {content}")
            return {"error": "Failed to parse JSON from LLM", "raw": content}

    except Exception as e:
        logger.error(f"LLM Call Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Test
    print("Testing question generation...")
    res = generate_questions("Python Backend Developer")
    print(json.dumps(res, indent=2))
