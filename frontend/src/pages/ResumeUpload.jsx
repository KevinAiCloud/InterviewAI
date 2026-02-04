import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { uploadResume } from '../services/api';

const ResumeUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

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
    };

    const handleSubmit = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            // In a real hackathon scenario, we might want to skip actual upload if backend isn't ready
            // await uploadResume(formData);

            // Simulate API call for demo purposes if backend fails or doesn't exist
            await new Promise(resolve => setTimeout(resolve, 1500));

            navigate('/video');
        } catch (err) {
            console.error(err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
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
                <source src="/videos/resume-vid.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-slate-900/70" />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3">
                        Upload Your Resume
                    </h1>
                    <p className="text-lg text-blue-100 drop-shadow-md">
                        Let's start by getting to know your professional background
                    </p>
                </div>

                <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                    {!file ? (
                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${isDragOver
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30" />
                                    <div className="relative p-5 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg">
                                        <UploadCloud className="w-12 h-12" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Click to upload or drag and drop
                                </h3>
                                <p className="text-sm text-slate-500 mb-8">
                                    PDF only (max. 2MB)
                                </p>

                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="resume-upload">
                                    <Button className="pointer-events-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 shadow-lg border-0">
                                        Select File
                                    </Button>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 flex items-center justify-between border-2 border-green-200">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-30" />
                                    <div className="relative p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-lg">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                        {file.name}
                                    </h4>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-2 hover:bg-red-100 rounded-full text-slate-600 hover:text-red-600 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border-2 border-red-200">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-slate-100">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!file || uploading}
                            className="min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg border-0"
                        >
                            {uploading ? <Loader size="small" className="text-white" /> : 'Continue'}
                        </Button>
                    </div>
                </Card>

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
