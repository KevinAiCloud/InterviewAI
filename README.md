# InterviewAI

AI-powered interview preparation and assessment platform built with React + Firebase + Python.

## Features

- **Resume Analysis**: AI-powered resume parsing and feedback
- **Video Interview**: Practice interviews with AI analysis
- **MCQ Assessment**: Skill-based multiple choice questions
- **Results Dashboard**: Comprehensive performance analytics

## Tech Stack

- **Frontend**: React (Vite), Firebase Authentication, Firestore
- **Backend**: Python FastAPI microservices
- **AI/ML**: OpenRouter LLM APIs, YOLOv8

## Project Structure

```
InterviewAI/
├── frontend/              # React Vite application
│   ├── src/
│   │   ├── auth/         # Authentication components
│   │   ├── components/   # Reusable UI components
│   │   ├── firebase/     # Firebase configuration
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── .env.example      # Frontend environment template
├── backend/
│   ├── resume-parser/    # Resume analysis service
│   ├── video-analysis/   # Video interview analysis
│   └── assessment/       # MCQ assessment engine
└── .gitignore
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Firebase project

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase credentials
npm install
npm run dev
```

### Backend Services

Each backend service has its own setup:

```bash
cd backend/resume-parser
cp .env.example .env
# Edit .env with your OpenRouter API key
pip install -r requirements.txt
python api.py
```

Repeat for `video-analysis` and `assessment` services.

## Environment Variables

See `.env.example` files in each directory for required variables:

- `frontend/.env.example` - Firebase configuration
- `backend/resume-parser/.env.example` - OpenRouter API key
- `backend/video-analysis/.env.example` - OpenAI/OpenRouter API key
- `backend/assessment/.env.example` - OpenRouter API key

## License

MIT
