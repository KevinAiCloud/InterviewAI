import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getQuestions } from '../services/api';

// Mock data in case API fails or for development
const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1
    },
    {
        id: 2,
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Tree", "Stack", "Graph"],
        correctAnswer: 2
    },
    {
        id: 3,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mark Language", "Home Tool Markup Language"],
        correctAnswer: 0
    },
    {
        id: 4,
        question: "In React, which hook is used for side effects?",
        options: ["useState", "useContext", "useEffect", "useReducer"],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "Which CSS property controls the spacing between elements?",
        options: ["padding", "margin", "border", "spacing"],
        correctAnswer: 1
    }
];

const McqQuiz = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setQuestions(MOCK_QUESTIONS);
        } catch (err) {
            console.warn("Using mock data due to error:", err);
            setQuestions(MOCK_QUESTIONS);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const isAllAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    const handleSubmit = async () => {
        if (!isAllAnswered) return;

        setSubmitting(true);

        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        setSubmitting(false);
        navigate('/result', { state: { score, total: questions.length } });
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/video-1.mp4" type="video/mp4" />
                </video>
                <div className="relative z-10 flex flex-col items-center">
                    <Loader size="large" className="text-white" />
                    <p className="mt-4 text-white text-lg font-medium drop-shadow-lg">Loading your assessment...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/video-1.mp4" type="video/mp4" />
                </video>
                <div className="relative z-10 max-w-xl mx-auto py-12 px-4">
                    <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Questions Available</h2>
                        <p className="text-slate-600 mb-6">We couldn't load the quiz questions at this time.</p>
                        <Button onClick={fetchQuestions} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold border-0">
                            Try Again
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover"
            >
                <source src="/videos/video-1.mp4" type="video/mp4" />
            </video>

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                            Technical Assessment
                        </h1>
                        <p className="text-lg text-blue-100 drop-shadow-md">
                            Please answer all questions to complete the application
                        </p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm text-blue-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                        <Clock className="w-5 h-5" />
                        <span>Take your time</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <Card key={q.id} className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold mr-3">
                                    {index + 1}
                                </span>
                                {q.question}
                            </h3>

                            <div className="space-y-3">
                                {q.options.map((option, optIndex) => (
                                    <label
                                        key={optIndex}
                                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[q.id] === optIndex
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 ring-2 ring-blue-400 shadow-md'
                                                : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={optIndex}
                                            checked={answers[q.id] === optIndex}
                                            onChange={() => handleOptionSelect(q.id, optIndex)}
                                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 mr-3"
                                        />
                                        <span className={`text-base ${answers[q.id] === optIndex ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={!isAllAnswered || submitting}
                        className="w-full sm:w-auto text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all border-0"
                    >
                        {submitting ? (
                            <Loader size="small" className="text-white" />
                        ) : (
                            <>
                                Submit Application <CheckCircle className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>
                </div>

                {!isAllAnswered && (
                    <p className="text-center text-white text-sm mt-4 font-medium drop-shadow-md bg-black/30 backdrop-blur-sm py-2 px-4 rounded-lg inline-block mx-auto block">
                        Please answer all questions to enable submission
                    </p>
                )}

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                    </div>
                    <p className="text-sm text-white uppercase tracking-wider font-bold drop-shadow-md">Step 3 of 3</p>
                </div>
            </div>
        </div>
    );
};

export default McqQuiz;
