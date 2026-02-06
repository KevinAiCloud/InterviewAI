@echo off
echo Starting InterviewAI Backend Services...

echo Starting Resume Parser (Port 8001)...
start "Resume Parser" cmd /k "python backend/resume-parser/api.py"

echo Starting Video Analysis (Port 8002)...
start "Video Analysis" cmd /k "python backend/video-analysis/api/server.py"

echo Starting Assessment Engine (Port 8003)...
start "Assessment Engine" cmd /k "python backend/assessment/api.py"

echo All services started!
echo Resume Parser: http://localhost:8001
echo Video Analysis: http://localhost:8002
echo Assessment Engine: http://localhost:8003
pause
