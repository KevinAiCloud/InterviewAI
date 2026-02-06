import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, Home, TrendingUp, Award, Video, FileText, Brain } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [animateScore, setAnimateScore] = useState(false);

    // MCQ Quiz Data
    const mcqScore = location.state?.score ?? 4;
    const mcqTotal = location.state?.total ?? 5;

    // Resume Analysis Data
    const resumeAnalysis = JSON.parse(localStorage.getItem('resumeAnalysisResult') || '{}');
    const resumeScore = resumeAnalysis?.score ?? 7;

    // Video Analysis Data
    const videoAnalysis = JSON.parse(localStorage.getItem('videoAnalysisResult') || '{}');
    const videoScore = videoAnalysis?.final_score ?? 6;

    // Calculate total percentage
    const mcqPercentage = (mcqScore / mcqTotal) * 100;
    const resumePercentage = (resumeScore / 10) * 100;
    const videoPercentage = (videoScore / 10) * 100;

    const overallPercentage = Math.round((mcqPercentage + resumePercentage + videoPercentage) / 3);

    useEffect(() => {
        setTimeout(() => setAnimateScore(true), 300);
    }, []);

    const getPerformanceData = () => {
        if (overallPercentage >= 80) {
            return {
                level: 'Excellent',
                message: 'Outstanding work! You have demonstrated excellent knowledge.',
                color: 'green',
                icon: Trophy,
                bgGradient: 'from-green-500 to-emerald-600'
            };
        } else if (overallPercentage >= 60) {
            return {
                level: 'Good',
                message: 'Well done! You have a good grasp of the fundamentals.',
                color: 'blue',
                icon: Award,
                bgGradient: 'from-blue-500 to-indigo-600'
            };
        } else if (overallPercentage >= 40) {
            return {
                level: 'Fair',
                message: 'Keep practicing! You\'re on the right track.',
                color: 'yellow',
                icon: TrendingUp,
                bgGradient: 'from-yellow-500 to-orange-600'
            };
        } else {
            return {
                level: 'Needs Improvement',
                message: 'Don\'t worry! Every expert was once a beginner.',
                color: 'red',
                icon: TrendingUp,
                bgGradient: 'from-red-500 to-pink-600'
            };
        }
    };

    const performanceData = getPerformanceData();
    const Icon = performanceData.icon;

    const MultiSegmentPieChart = () => {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;

        // Calculate segment sizes
        const resumeSegment = (resumePercentage / 100) * circumference;
        const videoSegment = (videoPercentage / 100) * circumference;
        const mcqSegment = (mcqPercentage / 100) * circumference;

        // Calculate offsets for each segment
        const offset1 = 0;
        const offset2 = -resumeSegment;
        const offset3 = -(resumeSegment + videoSegment);

        return (
            <div className="relative w-72 h-72 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="45"
                    />

                    {/* Resume segment (Purple) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="45"
                        strokeDasharray={`${resumeSegment} ${circumference}`}
                        strokeDashoffset={offset1}
                        className={`transition-all duration-1000 ease-out ${animateScore ? 'opacity-100' : 'opacity-0'}`}
                        strokeLinecap="round"
                    />

                    {/* Video segment (Blue) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="45"
                        strokeDasharray={`${videoSegment} ${circumference}`}
                        strokeDashoffset={offset2}
                        className={`transition-all duration-1000 delay-150 ease-out ${animateScore ? 'opacity-100' : 'opacity-0'}`}
                        strokeLinecap="round"
                    />

                    {/* MCQ segment (Green) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="45"
                        strokeDasharray={`${mcqSegment} ${circumference}`}
                        strokeDashoffset={offset3}
                        className={`transition-all duration-1000 delay-300 ease-out ${animateScore ? 'opacity-100' : 'opacity-0'}`}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-extrabold bg-gradient-to-br ${performanceData.bgGradient} bg-clip-text text-transparent transition-all duration-700 ${animateScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        {overallPercentage}%
                    </div>
                    <div className="text-sm text-slate-700 font-bold mt-2 bg-white px-4 py-1.5 rounded-full shadow-lg">Overall</div>
                </div>
            </div>
        );
    };

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
                <source src="/videos/video-4.mp4" type="video/mp4" />
            </video>

            {/* Content */}
            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${performanceData.bgGradient} text-white mb-6 shadow-2xl transition-all duration-500 ${animateScore ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                            <Icon className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
                            Assessment Complete!
                        </h1>
                        <p className="text-xl text-blue-100 drop-shadow-md font-medium">
                            {performanceData.message}
                        </p>
                    </div>

                    {/* Main Results Card with Pie Chart */}
                    <Card className="p-8 mb-6 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Pie Chart */}
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Score Breakdown</h3>
                                <MultiSegmentPieChart />

                                {/* Legend */}
                                <div className="mt-8 space-y-3 w-full max-w-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-purple-500"></div>
                                        <span className="text-sm font-bold text-slate-700">Resume Analysis</span>
                                        <span className="ml-auto text-lg font-extrabold text-purple-600">{Math.round(resumePercentage)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                                        <span className="text-sm font-bold text-slate-700">Video Interview</span>
                                        <span className="ml-auto text-lg font-extrabold text-blue-600">{Math.round(videoPercentage)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-bold text-slate-700">MCQ Assessment</span>
                                        <span className="ml-auto text-lg font-extrabold text-green-600">{Math.round(mcqPercentage)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Badge & Summary */}
                            <div className="flex flex-col justify-center space-y-4">
                                <div className={`p-6 rounded-xl text-center bg-gradient-to-r ${performanceData.bgGradient} text-white shadow-2xl`}>
                                    <p className="text-sm font-bold opacity-90 uppercase tracking-wider">Performance Level</p>
                                    <p className="text-4xl font-extrabold mt-2">{performanceData.level}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500 rounded-lg">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">Resume</span>
                                        </div>
                                        <span className="text-2xl font-extrabold text-purple-600">{resumeScore}/10</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <Video className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">Video</span>
                                        </div>
                                        <span className="text-2xl font-extrabold text-blue-600">{videoScore}/10</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500 rounded-lg">
                                                <Brain className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">MCQ Quiz</span>
                                        </div>
                                        <span className="text-2xl font-extrabold text-green-600">{mcqScore}/{mcqTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Detailed Breakdown */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* Resume Details */}
                        {resumeAnalysis?.reasoning && (
                            <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    Resume Analysis
                                </h3>
                                <div className="space-y-2">
                                    {resumeAnalysis.reasoning.map((reason, idx) => (
                                        <p key={idx} className="text-sm text-slate-700 leading-relaxed">
                                            • {reason}
                                        </p>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Video Details */}
                        {videoAnalysis?.transcript && (
                            <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                    <Video className="w-5 h-5 text-blue-600" />
                                    Video Analysis
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-slate-700">ID Verified:</span>
                                        <span className={`font-bold ${videoAnalysis.id_card_present ? 'text-green-600' : 'text-red-600'}`}>
                                            {videoAnalysis.id_card_present ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-slate-700">Communication:</span>
                                        <span className="font-bold text-blue-600">{videoAnalysis.audio_score}/10</span>
                                    </div>
                                    {videoAnalysis.transcript && (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-xs text-slate-600 italic line-clamp-4">"{videoAnalysis.transcript}"</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* MCQ Details */}
                        <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                            <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-green-600" />
                                MCQ Assessment
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-semibold text-slate-700">Correct</span>
                                    </div>
                                    <span className="text-xl font-extrabold text-green-600">{mcqScore}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-semibold text-slate-700">Incorrect</span>
                                    </div>
                                    <span className="text-xl font-extrabold text-red-600">{mcqTotal - mcqScore}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-slate-700">Total</span>
                                    </div>
                                    <span className="text-xl font-extrabold text-blue-600">{mcqTotal}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Next Steps */}
                    <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4">What's Next?</h3>
                        <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                            Your application has been successfully submitted! Our admissions team will review your responses and get back to you within 3-5 business days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/" className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all border-0">
                                    <Home className="w-5 h-5 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Button
                                className="flex-1 bg-slate-800 text-white hover:bg-slate-900 font-bold py-4 shadow-lg hover:shadow-xl transition-all border-0"
                                onClick={() => window.print()}
                            >
                                Download Results
                            </Button>
                        </div>
                    </Card>

                    {/* Footer Message */}
                    <div className="mt-8 text-center">
                        <p className="text-white text-base font-bold drop-shadow-lg bg-black/30 backdrop-blur-sm py-3 px-6 rounded-xl inline-block">
                            Thank you for applying to <span className="text-blue-300">PEP / HOPE</span>. We look forward to having you join our community!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
