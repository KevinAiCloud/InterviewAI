import os
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# Suppress noisy HTTP logs
import logging
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)

# Define the structured output using Pydantic
class AnalysisResult(BaseModel):
    score: int = Field(description="A compatibility score between 0 and 100 based on the match analysis.")
    reasoning: list[str] = Field(
        description="Exactly 2 lines of reasoning. Each line should mention a specific strength, e.g., 'You excel in...'",
        min_items=2,
        max_items=2
    )

def analyze_resume(resume_text: str, job_description: str):
    """
    Analyzes a resume against a job description using an LLM.
    Returns: A dictionary (structured JSON) containing the score and reasoning.
    """
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables.")

    # Initialize the LLM pointing to OpenRouter
    llm = ChatOpenAI(
        model="liquid/lfm-2.5-1.2b-instruct:free",
        openai_api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        temperature=0.1,  # Low temperature for consistent output
    )

    # Setup the output parser
    parser = JsonOutputParser(pydantic_object=AnalysisResult)

    # Define the system and user prompts
    system_prompt_text = (
        "You are an expert HR Recruitment AI with a strict, evidence-driven evaluation standard. Your task is to critically analyze a candidate's resume against a provided job description.\n"
        "You must output ONLY valid JSON without any markdown formatting or extra text.\n"
        "1. **Domain Check**: First, verify if the candidate's primary domain matches the job's domain. If the Resume is for 'Software Engineering' but the Job is for 'Dancer', 'Chef', etc., the score MUST be 0. No exceptions.\n"
        "2. **Strict Evaluation**: Evaluate alignment rigorously. Assume the role is highly competitive.\n"
        "3. **Scoring**: Assign a match score out of 10. Scores above 8 must reflect near-exact skill, experience, and impact alignment.\n"
        "4. **Penalties**: Penalize vague experience, keyword stuffing, shallow exposure, missing core requirements, or inflated claims.\n"
        "5. **Reasoning**: Provide exactly 2 concise lines of reasoning. If the domains do not match, state that clearly (e.g., 'Resume lacks required domain expertise for this role.').\n"
        "Do NOT use encouraging, polite, or motivational language. Be direct, neutral, and professional.\n"
        "\n"
        "{format_instructions}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt_text),
        ("user", "RESUME CONTENT:\n{resume}\n\nJOB DESCRIPTION:\n{jd}")
    ])

    # Create the chain components
    # chain = prompt | llm | parser  <-- previous approach
    
    # Invoke sequentially for debugging
    try:
        # 1. Format Prompt
        prompt_val = prompt.invoke({
            "resume": resume_text, 
            "jd": job_description, 
            "format_instructions": parser.get_format_instructions()
        })
        
        # 2. Call LLM
        print("DEBUG: Sending request to LLM...")
        llm_response = llm.invoke(prompt_val)
        print(f"DEBUG: Raw LLM Response content: {llm_response.content}")
        
        if not llm_response.content:
            return {"error": "Empty response from LLM", "score": 0, "reasoning": ["Model returned empty string."]}

        # 3. Parse JSON
        parsed_response = parser.invoke(llm_response)
        
        return parsed_response

    except Exception as e:
        print(f"DEBUG: Exception in chain: {e}")
        return {"error": str(e), "raw_response": "Failed to parse JSON", "score": 0, "reasoning": ["Error in analysis."]}

if __name__ == "__main__":
    # Simple test block
    print("This module is intended to be imported. Run main.py instead.")
