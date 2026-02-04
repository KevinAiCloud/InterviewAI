import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
            <p className="text-xl text-slate-600 mb-8">Page not found</p>
            <Link to="/">
                <Button variant="primary">Go Home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
