// Login.jsx - UI ONLY
// NO navigation here. Navigation is driven by auth state.
// NO onAuthStateChanged here.

import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login, signup, loginWithGoogle, currentUser, loading } = useAuth();
    const location = useLocation();

    // Where to redirect after login (default to home)
    const from = location.state?.from?.pathname || '/';

    // If user is already logged in, redirect
    // This is STATE-DRIVEN navigation, not event-driven
    if (!loading && currentUser) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setError('');
            setSubmitting(true);

            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }

            // NO NAVIGATE HERE!
            // onAuthStateChanged will update currentUser
            // The useEffect above will handle redirect
        } catch (err) {
            console.error(err);
            if (isLogin) {
                setError('Failed to sign in. Check your email/password.');
            } else {
                setError('Failed to create account. Password should be 6+ chars.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setSubmitting(true);
            await loginWithGoogle();
            // NO NAVIGATE HERE!
            // onAuthStateChanged will update currentUser
            // The component will re-render and redirect via Navigate
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden py-12">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/video-1.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-slate-900/90" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h1>
                    <p className="text-blue-100 drop-shadow-md">
                        {isLogin ? 'Sign in to continue your journey' : 'Create an account to get started'}
                    </p>
                </div>

                <Card className="p-8 bg-white/95 backdrop-blur-md border-0 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 shadow-lg border-0"
                        >
                            {submitting ? <Loader size="small" className="text-white" /> : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="text-blue-600 font-bold hover:text-blue-700 underline"
                                disabled={submitting}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-slate-700 font-bold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                            >
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 20.45c4.6483 0 8.5401-3.2355 9.7716-7.55h-9.7716v-3.8h13.9213c.123.6375.1876 1.305.1876 2 0 7.0298-5.32 12.45-12.1092 12.45C5.8643 23.55 0.7497 18.0645 0.7497 11.4s5.1146-12.15 11.2506-12.15c3.0441 0 5.8665 1.125 8.0199 2.97l-2.6853 3.075c-1.4253-1.095-3.3153-1.695-5.3346-1.695-4.5264 0-8.2974 3.7313-8.2974 8.7s3.771 8.7 8.2974 8.7z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12.0003 4.8c1.6515 0 3.1254.585 4.3014 1.545l3.2016-3.21C17.4357 1.41 14.8812 0.3 12.0003 0.3 7.3719 0 3.2847 2.655 1.2597 6.57l3.78 2.94C6.2736 6.81 8.9136 4.8 12.0003 4.8z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M21.7716 12.9h-9.7716v3.8h9.7716c-.45 2.37-2.3103 4.41-4.7214 5.37l-3.2016 3.21c3.963-1.83 6.9606-5.61 7.923-10.38z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M5.0397 9.51C4.5429 10.95 4.5429 12.51 5.0397 13.95L1.2597 16.89C-0.4203 13.41-0.4203 9.39 1.2597 5.91l3.78 2.94c-.2442 1.35-.2442 2.76 0 4.11z"
                                        fill="#34A853"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
