from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import logging
from typing import Optional

# Import our existing logic
from resumeparser import ResumeParser
from llm import analyze_resume

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("api")

app = FastAPI(title="Resume Analyzer API")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class AnalyzeRequest(BaseModel):
    job_description: str

class AnalysisResponse(BaseModel):
    score: int
    reasoning: list[str]

@app.get("/")
def read_root():
    return {"message": "Resume Analyzer API is running"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Endpoint to analyze a resume PDF against a job description.
    Accepts:
    - file: PDF file upload
    - job_description: String (Form data)
    """
    
    # 1. Validate File
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF is supported.")
    
    temp_filename = f"temp_{file.filename}"
    
    try:
        # 2. Save Uploaded File Temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File saved to {temp_filename}")

        # 3. Parse PDF
        parser = ResumeParser()
        try:
            resume_text = parser.parse(temp_filename)
        except Exception as e:
            logger.error(f"Parsing error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
            
        if not resume_text:
             raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 4. Analyze with LLM
        logger.info("Analyzing with LLM...")
        try:
            result = analyze_resume(resume_text, job_description)
            
            # Handle potential error response from llm.py if it returned dict with error
            if "error" in result:
                raise HTTPException(status_code=500, detail=f"AI Analysis failed: {result.get('error')}")

            return result

        except Exception as e:
            logger.error(f"Analysis error: {e}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    finally:
        # 5. Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            logger.info(f"Cleaned up {temp_filename}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
