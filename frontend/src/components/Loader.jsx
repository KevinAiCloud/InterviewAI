import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
        </div>
    );
};

export default Loader;
