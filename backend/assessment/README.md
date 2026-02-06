# AI Assessment Module

A standalone module for generating and evaluating technical assessments using LLMs.

## Structure
- `api.py`: FastAPI application with `/start` and `/submit` endpoints.
- `llm.py`: Handles interaction with OpenRouter/Gemini for question generation.
- `assessment_engine.py`: Logic for scoring.
- `main.py`: CLI tool for testing the flow without a frontend.

## Setup
1. Ensure `.env` exists in `backend/` or `backend/assessment/` with `OPENROUTER_API_KEY`.
2. Install dependencies (same as root project).

## Usage
### CLI
```bash
python main.py
```

### API
Run the server:
```bash
python api.py
```
Server runs on port `8002` by default.

**Endpoints:**
- `POST /start`: `{"job_description": "..."}` -> Returns questions & session ID.
- `POST /submit`: `{"session_id": "...", "answers": {"0": "A", ...}}` -> Returns score.
