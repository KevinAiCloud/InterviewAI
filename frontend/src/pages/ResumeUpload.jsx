import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle, Brain, Sparkles, Briefcase, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAuth } from '../auth/AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import { uploadResume } from '../services/api';

const ResumeUpload = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError('');

        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
            setError('File size should not exceed 2MB.');
            return;
        }

        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setError('');
        setAnalysisResult(null);
    };

    const saveScoreToFirestore = async (result) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, "scores"), {
                uid: currentUser.uid,
                email: currentUser.email,
                type: "resume",
                score: result.score,
                timestamp: serverTimestamp(),
                details: {
                    fileName: file?.name,
                    jobDescription: jobDescription.substring(0, 100) + "..."
                }
            });
        } catch (error) {
            console.error("Error saving score to Firestore:", error);
        }
    };

    const handleSubmit = async () => {
        // Auth Check
        if (!currentUser) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!file) return;
        if (!jobDescription.trim()) {
            setError('Please enter a Job Description.');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDescription);

        try {
            const data = await uploadResume(formData);
            setAnalysisResult(data);

            // Save Job Description for the Quiz later
            localStorage.setItem('jobDescription', jobDescription);

            // Save Resume Analysis Result for Results Page
            localStorage.setItem('resumeAnalysisResult', JSON.stringify(data));

            // Save to Firestore
            await saveScoreToFirestore(data);

        } catch (err) {
            console.error(err);
            setError(err.detail || err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleContinue = () => {
        navigate('/video');
    };

    return (
        <div className="relative min-h-[calc(100vh-12rem)] flex items-center justify-center overflow-hidden py-12">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/resume-vid.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-slate-900/70" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3">
                        AI Resume Analysis
                    </h1>
                    <p className="text-lg text-blue-100 drop-shadow-md">
                        Upload your resume and job description to get instant feedback
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-1">
                    {!analysisResult ? (
                        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl transition-all duration-300">
                            {/* File Upload Section */}
                            <div className="mb-6">
                                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Upload Resume (PDF)
                                </label>
                                {!file ? (
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragOver
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                                            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-3">
                                                <UploadCloud className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm text-slate-500 mb-4">
                                                Drag & drop or click to upload (Max 2MB)
                                            </p>
                                            <input
                                                type="file"
                                                id="resume-upload"
                                                className="hidden"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="resume-upload" className="cursor-pointer">
                                                <div className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center">
                                                    Select PDF
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 truncate max-w-[200px]">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="p-1 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Job Description Section */}
                            <div className="mb-8">
                                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-600" />
                                    Job Description
                                </label>
                                <textarea
                                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-32 resize-none text-slate-700"
                                    placeholder="Paste the job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-slate-100">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!file || !jobDescription.trim() || uploading}
                                    className={`min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg border-0 transition-all ${uploading ? 'opacity-80' : 'hover:scale-105'}`}
                                >
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader size="small" className="text-white" />
                                            <span>Analyzing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {!currentUser && <Lock className="w-4 h-4" />}
                                            <Sparkles className="w-4 h-4" />
                                            <span>{currentUser ? 'Analyze Resume' : 'Login to Analyze'}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-0 overflow-hidden bg-white/95 backdrop-blur-md border-0 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-white/10 noise-bg" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                                        <Brain className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-1">Analysis Complete</h2>
                                    <p className="text-blue-100">Here's how your resume analyzes against the job description</p>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                                    {/* Score Circle */}
                                    <div className="relative w-40 h-40 shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke="#e2e8f0"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke={analysisResult.score >= 7 ? "#10b981" : analysisResult.score >= 4 ? "#f59e0b" : "#ef4444"}
                                                strokeWidth="12"
                                                strokeDasharray={`${2 * Math.PI * 70}`}
                                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysisResult.score / 10)}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-5xl font-extrabold ${analysisResult.score >= 7 ? "text-green-500" : analysisResult.score >= 4 ? "text-yellow-500" : "text-red-500"}`}>
                                                {analysisResult.score}
                                            </span>
                                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">/ 10</span>
                                        </div>
                                    </div>

                                    {/* Reasoning */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                            Key Insights
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysisResult.reasoning.map((point, index) => (
                                                <li key={index} className="flex gap-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium leading-relaxed">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => setAnalysisResult(null)}
                                        className="text-slate-500 hover:text-slate-800 font-medium text-sm hover:underline"
                                    >
                                        Analyze Another
                                    </button>
                                    <Button
                                        onClick={handleContinue}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2"
                                    >
                                        Continue to Interview
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <p className="text-sm text-white uppercase tracking-wider font-bold drop-shadow-md">Step 1 of 3</p>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
