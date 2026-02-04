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
                    {/* PEP Card - Enhanced */}
                    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 group hover:-translate-y-2">
                        {/* Gradient Background Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500" />

                        <div className="relative z-10 bg-gradient-to-br from-white via-blue-50/30 to-white p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-2xl" />
                                    <div className="relative p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <Users className="w-10 h-10" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1">PEP</h3>
                                    <p className="text-sm text-slate-500 font-semibold">Placement Empowerment Programme</p>
                                </div>
                            </div>

                            <p className="text-slate-700 mb-6 leading-relaxed text-base">
                                Designed to prepare students for top-tier placements through rigorous aptitude training,
                                mock interviews, and soft skills development. Perfect for final and pre-final year students.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">Aptitude & Logic building</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">Mock Interactions</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">Resume Building</span>
                                </div>
                            </div>

                            <Link to="/pep">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all border-0">
                                    Learn More →
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* HOPE Card - Enhanced */}
                    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 group hover:-translate-y-2">
                        {/* Gradient Background Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500" />

                        <div className="relative z-10 bg-gradient-to-br from-white via-indigo-50/30 to-white p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-2xl" />
                                    <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <Code className="w-10 h-10" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1">HOPE</h3>
                                    <p className="text-sm text-slate-500 font-semibold">House of Programming Expertise</p>
                                </div>
                            </div>

                            <p className="text-slate-700 mb-6 leading-relaxed text-base">
                                An exclusive club for competitive programmers and developers.
                                Master data structures, algorithms, and system design with peer learning and expert mentorship.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">DSA & CP Mastery</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">Hackathons & Projects</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">✓</div>
                                    <span className="font-medium">Tech Talks</span>
                                </div>
                            </div>

                            <Link to="/hope">
                                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all border-0">
                                    Learn More →
                                </Button>
                            </Link>
                        </div>
                    </Card>
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
