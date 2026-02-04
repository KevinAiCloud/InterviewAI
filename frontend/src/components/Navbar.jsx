import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-24">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-500 p-1.5 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                InterviewAI
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isHome && (
                            <Link to="/">
                                <Button variant="ghost" className="text-sm text-slate-300 hover:text-white hover:bg-slate-800">
                                    Back to Home
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
