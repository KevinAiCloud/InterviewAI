import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# Suppress noisy HTTP logs
import logging
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)

def analyze_resume(resume_text: str, job_description: str):
    """
    Analyzes a resume against a job description using an LLM.
    Returns: A dictionary (structured JSON) containing the score and reasoning.
    """
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables.")

    # Initialize the OpenAI client (pointing to OpenRouter)
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )

    # Define the system prompt
    system_prompt_text = (
        "You are a strict, evidence-based HR Recruitment AI. You must evaluate a resume ONLY against the given job description.\n"
        "You must output ONLY valid JSON with exactly two keys: 'score' and 'reasoning'. No extra text.\n"
        "1. **Hard Domain Gate**: Identify the PRIMARY job domain. If the job role and resume domains do not match, the score MUST be 0. Do NOT infer transferable skills.\n"
        "2. **Evidence-Only Rule**: Base all conclusions strictly on explicit statements in the resume. Do NOT assume or infer skills.\n"
        "3. **Scoring Rule (MANDATORY)**: The score MUST be an INTEGER between 0 and 10 (inclusive). "
        "Do NOT use percentages, decimals, or values above 10 under any circumstances.\n"
        "4. **Score Meaning**: 0 = no relevance, 5 = partial match, 8–10 = strong direct alignment with role-specific experience.\n"
        "5. **Reasoning**: Provide exactly 2 concise reasoning lines. If score is 0, explicitly state domain mismatch.\n"
        "Use neutral, professional language only. No encouragement, no speculation.\n"
        "\n"
        "Required JSON Format:\n"
        "{\n"
        '  "score": integer,\n'
        '  "reasoning": ["Reason 1", "Reason 2"]\n'
        "}"
    )

    user_prompt = f"RESUME CONTENT:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"

    try:
        print("DEBUG: Sending request to LLM (via OpenAI Client)...")
        
        response = client.chat.completions.create(
            model="x-ai/grok-4.1-fast",
            messages=[
                {"role": "system", "content": system_prompt_text},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        content = response.choices[0].message.content.strip()
        print(f"DEBUG: Raw LLM Response content: {content}")
        
        if not content:
            return {"error": "Empty response from LLM", "score": 0, "reasoning": ["Model returned empty string."]}

        # Parse JSON
        try:
            parsed_response = json.loads(content)
            
            # Simple validation
            if "score" not in parsed_response:
                 parsed_response["score"] = 0
            if "reasoning" not in parsed_response:
                 parsed_response["reasoning"] = ["Analysis failed to produce reasoning."]
                 
            return parsed_response

        except json.JSONDecodeError:
             # Try to find JSON block using regex if pure parse failed
            import re
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                try:
                    return json.loads(json_str)
                except:
                    pass

            print(f"DEBUG: JSON failure. Content was: {content}")
            return {"error": "Invalid JSON from AI", "score": 0, "reasoning": ["AI returned malformed data."]}
            
    except Exception as e:
        print(f"DEBUG: Exception in LLM call: {e}")
        return {"error": str(e), "raw_response": "Failed to parse JSON", "score": 0, "reasoning": ["Error in analysis."]}

if __name__ == "__main__":
    # Simple test block
    print("This module is intended to be imported. Run main.py instead.")
