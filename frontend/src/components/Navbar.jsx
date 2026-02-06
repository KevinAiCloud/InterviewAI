import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, User, Shield } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../auth/AuthProvider';

const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { currentUser, logout, isAdmin } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
        } catch (error) {
            console.error("Failed to log out", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-24">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-500 p-1.5 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                InterviewAI
                            </span>
                        </Link>

                        {/* Login Button on Top Left (if not logged in) */}
                        {!currentUser && (
                            <Link to="/login">
                                <Button variant="ghost" className="text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link to="/admin">
                                        <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm border-0 flex items-center gap-2 py-1.5">
                                            <Shield className="w-4 h-4" />
                                            Admin
                                        </Button>
                                    </Link>
                                )}

                                <div className="hidden md:flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                                    <User className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium truncate max-w-[150px]">{currentUser.email}</span>
                                </div>

                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    disabled={loggingOut}
                                    className="text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            !isHome && (
                                <Link to="/">
                                    <Button variant="ghost" className="text-sm text-slate-300 hover:text-white hover:bg-slate-800">
                                        Back to Home
                                    </Button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
