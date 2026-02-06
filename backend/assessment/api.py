from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uuid
import logging

# Import logic
from llm import generate_questions
from assessment_engine import evaluate_submission
from config import QUESTION_COUNT

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("api")

app = FastAPI(title="Assessment API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Session Storage ---
# Stores: session_id -> { "correct_answers": {0: "A", 1: "B", ...}, "questions": [...] }
ACTIVE_SESSIONS = {}

# --- Models ---
class StartAssessmentRequest(BaseModel):
    job_description: Optional[str] = None

class QuestionResponse(BaseModel):
    session_id: str
    questions: List[Dict] # We send questions without answers

class SubmitAssessmentRequest(BaseModel):
    session_id: str
    answers: Dict[str, str] # { "0": "A", "1": "C" }

class AssessmentResult(BaseModel):
    total_questions: int
    correct_answers: int
    score: int

@app.get("/")
def read_root():
    return {"message": "Assessment API is running"}

@app.post("/start", response_model=QuestionResponse)
async def start_assessment(request: StartAssessmentRequest):
    """
    Generates questions based on optional job description.
    Stores correct answers in memory.
    Returns questions + session_id.
    """
    logger.info(f"Starting assessment for description: {request.job_description}")
    
    # 1. Generate Questions
    result = generate_questions(request.job_description)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    questions_data = result.get("questions", [])
    if not questions_data:
        raise HTTPException(status_code=500, detail="Failed to generate questions")

    # 2. Extract Correct Answers & Prepare Client Payload
    correct_answers_map = {}
    client_questions = []
    
    for idx, q in enumerate(questions_data):
        correct_answers_map[idx] = q["answer"]
        
        # Create a copy without the answer for the client
        q_client = q.copy()
        if "answer" in q_client:
            del q_client["answer"]
        q_client["id"] = idx # Add explicit ID
        client_questions.append(q_client)
        
    # 3. Create Session
    session_id = str(uuid.uuid4())
    ACTIVE_SESSIONS[session_id] = {
        "correct_answers": correct_answers_map,
        "questions": questions_data # Store full data just in case
    }
    
    logger.info(f"Created session {session_id} with {len(client_questions)} questions.")

    return {
        "session_id": session_id,
        "questions": client_questions
    }

@app.post("/submit", response_model=AssessmentResult)
async def submit_assessment(request: SubmitAssessmentRequest):
    """
    Evaluates user answers for a given session.
    """
    session_id = request.session_id
    user_answers = request.answers
    
    if session_id not in ACTIVE_SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found or expired.")
        
    session_data = ACTIVE_SESSIONS[session_id]
    correct_answers = session_data["correct_answers"]
    
    # Evaluate
    result = evaluate_submission(correct_answers, user_answers)
    
    logger.info(f"Session {session_id} score: {result['score']}/{result['total_questions']}")
    
    # Cleanup Session (Stateless mindset - clear after use)
    del ACTIVE_SESSIONS[session_id]
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
