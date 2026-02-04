import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, Home, TrendingUp, Award } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [animateScore, setAnimateScore] = useState(false);

    const score = location.state?.score ?? 4;
    const total = location.state?.total ?? 5;

    const percentage = Math.round((score / total) * 100);
    const incorrect = total - score;

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const correctStrokeDasharray = (score / total) * circumference;

    useEffect(() => {
        setTimeout(() => setAnimateScore(true), 300);
    }, []);

    const getPerformanceData = () => {
        if (percentage >= 80) {
            return {
                level: 'Excellent',
                message: 'Outstanding work! You have demonstrated excellent knowledge.',
                color: 'green',
                icon: Trophy,
                bgGradient: 'from-green-500 to-emerald-600'
            };
        } else if (percentage >= 60) {
            return {
                level: 'Good',
                message: 'Well done! You have a good grasp of the fundamentals.',
                color: 'blue',
                icon: Award,
                bgGradient: 'from-blue-500 to-indigo-600'
            };
        } else if (percentage >= 40) {
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

    const PieChart = () => {
        return (
            <div className="relative w-64 h-64 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="40"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="40"
                        strokeDasharray={`${correctStrokeDasharray} ${circumference}`}
                        strokeDashoffset={0}
                        className={`transition-all duration-1000 ease-out ${animateScore ? 'opacity-100' : 'opacity-0'}`}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-extrabold bg-gradient-to-br ${performanceData.bgGradient} bg-clip-text text-transparent transition-all duration-700 ${animateScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        {percentage}%
                    </div>
                    <div className="text-sm text-slate-700 font-bold mt-2 bg-slate-100 px-3 py-1 rounded-full">Score</div>
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
                <div className="max-w-4xl mx-auto">
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

                    {/* Main Results Card */}
                    <Card className="p-8 mb-6 shadow-2xl border-0 bg-white backdrop-blur-sm">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Pie Chart */}
                            <div className="flex items-center justify-center">
                                <PieChart />
                            </div>

                            {/* Statistics */}
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">Correct Answers</span>
                                        </div>
                                        <span className="text-3xl font-extrabold text-green-600">{score}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-300 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-500 rounded-lg">
                                                <XCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">Incorrect Answers</span>
                                        </div>
                                        <span className="text-3xl font-extrabold text-red-600">{incorrect}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-bold text-slate-900">Total Questions</span>
                                        </div>
                                        <span className="text-3xl font-extrabold text-blue-600">{total}</span>
                                    </div>
                                </div>

                                {/* Performance Badge */}
                                <div className={`mt-4 p-6 rounded-xl text-center bg-gradient-to-r ${performanceData.bgGradient} text-white shadow-2xl`}>
                                    <p className="text-sm font-bold opacity-90 uppercase tracking-wider">Performance Level</p>
                                    <p className="text-3xl font-extrabold mt-1">{performanceData.level}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Next Steps */}
                    <Card className="p-8 bg-white backdrop-blur-sm border-0 shadow-2xl">
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
