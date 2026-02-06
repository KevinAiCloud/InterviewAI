import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { startAssessment, submitAssessment } from '../services/api';
import { useAuth } from '../auth/AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const McqQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const jobDescription = localStorage.getItem('jobDescription') || '';
            const data = await startAssessment(jobDescription);

            if (data.questions && data.session_id) {
                setQuestions(data.questions);
                setSessionId(data.session_id);
            } else {
                throw new Error("Invalid response format");
            }

        } catch (err) {
            console.error("Error fetching assessment:", err);
            setError("Failed to load assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionValue) => {
        // questionId is coming from backend as int or str, let's keep it consistent
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionValue
        }));
    };

    const isAllAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    const saveScoreToFirestore = async (result) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, "scores"), {
                uid: currentUser.uid,
                email: currentUser.email,
                type: "assessment",
                score: result.score,
                timestamp: serverTimestamp(),
                details: {
                    totalQuestions: result.total_questions
                }
            });
        } catch (error) {
            console.error("Error saving score to Firestore:", error);
        }
    };

    const handleSubmit = async () => {
        if (!isAllAnswered) return;

        // Auth Check
        if (!currentUser) {
            navigate('/login', { state: { from: location } });
            return;
        }

        setSubmitting(true);

        try {
            // Mapping backend expects answers: { "0": "A", "1": "C" }
            // Our answers state is { "0": "A", "1": "C" } directly from handleOptionSelect if we pass the value

            const result = await submitAssessment(sessionId, answers);

            // Save to Firestore
            await saveScoreToFirestore(result);

            // Navigate to result with the real score
            navigate('/result', { state: { score: result.score, total: result.total_questions } });

        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit assessment. Please try again.");
        } finally {
            setSubmitting(false);
        }
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
                    <p className="mt-4 text-white text-lg font-medium drop-shadow-lg">Generating your unique assessment...</p>
                </div>
            </div>
        );
    }

    if (error || questions.length === 0) {
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
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Assessment Generation Failed</h2>
                        <p className="text-slate-600 mb-6">{error || "No questions were generated."}</p>
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
                            Questions customized for your role
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
                                {q.options.map((option, optIndex) => {
                                    // Option is just a string. We need to map it to A, B, C, D for backend
                                    // Assuming backend returns options in order for A, B, C, D
                                    const optionLabel = ["A", "B", "C", "D"][optIndex];

                                    return (
                                        <label
                                            key={optIndex}
                                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[q.id] === optionLabel
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 ring-2 ring-blue-400 shadow-md'
                                                : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={optionLabel}
                                                checked={answers[q.id] === optionLabel}
                                                onChange={() => handleOptionSelect(q.id, optionLabel)}
                                                className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 mr-3"
                                            />
                                            <span className={`text-base ${answers[q.id] === optionLabel ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>
                                                {option}
                                            </span>
                                        </label>
                                    );
                                })}
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
                                {currentUser ? (
                                    <>Submit Assessment <CheckCircle className="ml-2 w-5 h-5" /></>
                                ) : (
                                    <>Login to Submit <Lock className="ml-2 w-5 h-5" /></>
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default McqQuiz;
