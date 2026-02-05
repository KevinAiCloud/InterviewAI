import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-700 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} InterviewAI Admission System. Made for Hackathons.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
