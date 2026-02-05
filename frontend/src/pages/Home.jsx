import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Users } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section with Video Background */}
            <section className="relative bg-blue-600 text-white min-h-screen flex items-center overflow-hidden">
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

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-pretty z-10 w-full">
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 drop-shadow-lg">
                        Dream. Apply. Succeed! ✨
                    </h1>
                    <p className="text-2xl md:text-3xl text-blue-50 max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                        Gain skills, network with mentors, and shape your career with PEP & HOPE. Apply today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/resume">
                            <Button
                                variant="secondary"
                                className="w-full sm:w-auto text-lg px-8 py-4 font-bold shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:!bg-gradient-to-r hover:!from-blue-600 hover:!to-purple-600 hover:!text-white hover:!border-0"
                            >
                                Start Application <ArrowRight className="ml-2 w-5 h-5 inline-block" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Our Programs</h2>
                    <p className="text-slate-600 mt-2">Choose the path that fits your goals</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* PEP Card - Modern Rounded Style */}
                    <Link to="/pep" className="block">
                        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group">
                            {/* Decorative Elements */}
                            <div className="absolute top-6 right-6 w-16 h-16 bg-yellow-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="absolute bottom-6 left-6 w-20 h-20 bg-cyan-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-extrabold text-white">PEP</h3>
                                        <p className="text-sm text-blue-200 font-medium">Placement Empowerment</p>
                                    </div>
                                </div>

                                <p className="text-white/90 mb-6 leading-relaxed text-base">
                                    Prepare for top-tier placements with rigorous aptitude training, mock interviews, and soft skills development.
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-sm font-medium">Aptitude & Logic Building</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-sm font-medium">Mock Interactions</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-sm font-medium">Resume Building</span>
                                    </div>
                                </div>

                                <div className="inline-block px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-full transition-all group-hover:scale-105">
                                    Learn More →
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* HOPE Card - Modern Rounded Style */}
                    <Link to="/hope" className="block">
                        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-700 p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group">
                            {/* Decorative Elements */}
                            <div className="absolute top-6 right-6 w-16 h-16 bg-lime-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="absolute bottom-6 left-6 w-20 h-20 bg-pink-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <Code className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-extrabold text-white">HOPE</h3>
                                        <p className="text-sm text-purple-200 font-medium">Programming Expertise</p>
                                    </div>
                                </div>

                                <p className="text-white/90 mb-6 leading-relaxed text-base">
                                    Master data structures, algorithms, and system design with peer learning and expert mentorship.
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-lime-400" />
                                        <span className="text-sm font-medium">DSA & CP Mastery</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-lime-400" />
                                        <span className="text-sm font-medium">Hackathons & Projects</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-2 h-2 rounded-full bg-lime-400" />
                                        <span className="text-sm font-medium">Tech Talks</span>
                                    </div>
                                </div>

                                <div className="inline-block px-6 py-3 bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold rounded-full transition-all group-hover:scale-105">
                                    Learn More →
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Steps Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 rounded-3xl">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Application Process</h2>
                <div className="grid sm:grid-cols-3 gap-8 text-center relative z-10">
                    <div className="relative">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white shadow">1</div>
                        <h4 className="font-semibold text-slate-900 mb-2">Upload Resume</h4>
                        <p className="text-sm text-slate-500 px-4">Submit your latest resume in PDF format to get started.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden sm:block absolute top-6 left-[-50%] w-full h-0.5 bg-slate-200 -z-10"></div>
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white shadow">2</div>
                        <h4 className="font-semibold text-slate-900 mb-2">Take Video Interivew</h4>
                        <p className="text-sm text-slate-500 px-4">Record a short 2-minute video introducing yourself.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden sm:block absolute top-6 left-[-50%] w-full h-0.5 bg-slate-200 -z-10"></div>
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white shadow">3</div>
                        <h4 className="font-semibold text-slate-900 mb-2">MCQ Assessment</h4>
                        <p className="text-sm text-slate-500 px-4">Complete a quick technical assessment to prove your skills.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
