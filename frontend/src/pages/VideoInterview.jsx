import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Video, Mic, Square, Play, Upload, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAuth } from '../auth/AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const VideoInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoBlob, setVideoBlob] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            stopStream();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const startCamera = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true;
            }
            setPermissionGranted(true);
        } catch (err) {
            console.error(err);
            setError('Could not access camera/microphone. Please allow permissions.');
        }
    };

    const startRecording = () => {
        setRecordedChunks([]);
        setVideoBlob(null);
        setIsRecording(true);
        setTimeLeft(60);

        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks((prev) => [...prev, event.data]);
            }
        };

        mediaRecorder.start();

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        if (!isRecording && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            setVideoBlob(blob);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = URL.createObjectURL(blob);
                videoRef.current.muted = false;
                videoRef.current.controls = true;
            }
        }
    }, [isRecording, recordedChunks]);

    const resetRecording = () => {
        setVideoBlob(null);
        setRecordedChunks([]);
        setTimeLeft(60);
        setAnalysisResult(null);
        if (videoRef.current) {
            videoRef.current.src = '';
            videoRef.current.controls = false;
            videoRef.current.load();
        }
        startCamera();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const saveScoreToFirestore = async (result) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, "scores"), {
                uid: currentUser.uid,
                email: currentUser.email,
                type: "video",
                score: result.final_score,
                timestamp: serverTimestamp(),
                details: {
                    audioScore: result.audio_score,
                    videoValid: result.video_valid
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

        if (!videoBlob) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', videoBlob, 'interview.webm');

        try {
            const response = await fetch('http://localhost:8002/analyze-video', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            localStorage.setItem('videoAnalysisResult', JSON.stringify(data));
            setAnalysisResult(data);

            // Save to Firestore
            await saveScoreToFirestore(data);

        } catch (err) {
            console.error(err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleProceedToQuiz = () => {
        navigate('/quiz');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/interview-vid.mp4" type="video/mp4" />
            </video>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3">
                        Video Interview
                    </h1>
                    <p className="text-lg text-blue-100 drop-shadow-md">
                        Tell us about yourself and why you want to join this program
                    </p>
                </div>

                {analysisResult ? (
                    /* RESULT VIEW */
                    <div className="space-y-6">
                        <Card className="p-8 shadow-2xl border-0 bg-white backdrop-blur-sm">
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                                <Video className="w-6 h-6 text-indigo-600" />
                                Video Analysis Results
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="font-bold text-slate-700">ID Card Verified</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${analysisResult.id_card_present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {analysisResult.id_card_present ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="font-bold text-slate-700">Video Valid</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${analysisResult.video_valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {analysisResult.video_valid ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="font-bold text-slate-700">Communication Score</span>
                                        <span className="text-xl font-extrabold text-indigo-600">{analysisResult.audio_score}/10</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="font-bold text-slate-700">Overall Impression</span>
                                        <span className="text-xl font-extrabold text-purple-600">{analysisResult.final_score}/10</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transcript Section */}
                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Transcript Analysis</h4>
                                <p className="text-slate-800 italic">
                                    "{analysisResult.transcript || 'No verbal response detected.'}"
                                </p>
                            </div>

                            <div className="mt-8 flex justify-center gap-4">
                                <Button
                                    onClick={resetRecording}
                                    variant="ghost"
                                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retake Video
                                </Button>
                                <Button
                                    onClick={handleProceedToQuiz}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 shadow-lg border-0"
                                >
                                    Proceed to Assessment <Play className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Card className="p-1 sm:p-2 overflow-hidden bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            {!permissionGranted && !videoBlob ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30" />
                                        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                                            <Video className="w-16 h-16" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Camera Access Required</h3>
                                    <p className="text-blue-200 mb-8 text-center max-w-md">
                                        We need access to your camera and microphone to record your interview
                                    </p>
                                    <Button
                                        onClick={startCamera}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 shadow-lg border-0"
                                    >
                                        Enable Camera & Microphone
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />

                                    {isRecording && (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-full animate-pulse shadow-lg">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Status Text */}
                                <div className="text-sm font-bold">
                                    {isRecording ? (
                                        <span className="text-red-400 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                            Recording in progress...
                                        </span>
                                    ) : videoBlob ? (
                                        <span className="text-green-400 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            Recording completed
                                        </span>
                                    ) : permissionGranted ? (
                                        <span className="text-blue-300">Ready to record (Max 1 min)</span>
                                    ) : (
                                        <span className="text-slate-400">Setup required</span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {permissionGranted && (
                                    <div className="flex items-center gap-3">
                                        {!isRecording && !videoBlob && (
                                            <Button
                                                onClick={startRecording}
                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 font-bold shadow-lg"
                                            >
                                                <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                                                Start Recording
                                            </Button>
                                        )}

                                        {isRecording && (
                                            <Button
                                                onClick={stopRecording}
                                                className="bg-slate-700 hover:bg-slate-600 text-white border-0 font-bold"
                                            >
                                                <Square className="w-4 h-4 mr-2 fill-current" />
                                                Stop Recording
                                            </Button>
                                        )}

                                        {videoBlob && (
                                            <>
                                                <Button
                                                    onClick={resetRecording}
                                                    variant="ghost"
                                                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                                                >
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Retake
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={uploading}
                                                    className="min-w-[140px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg border-0"
                                                >
                                                    {uploading ? (
                                                        <Loader size="small" className="text-white" />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            {!currentUser && <Lock className="w-4 h-4" />}
                                                            <span>{currentUser ? 'Submit Interview' : 'Login to Submit'}</span>
                                                            <Upload className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-900/50 border-2 border-red-700 rounded-lg text-red-200 text-sm flex items-center gap-2 font-medium">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </Card>
                )
                }

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                        <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                        <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <p className="text-sm text-white uppercase tracking-wider font-bold drop-shadow-md">Step 2 of 3</p>
                </div>
            </div >
        </div >
    );
};

export default VideoInterview;
