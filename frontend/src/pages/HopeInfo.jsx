import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Trophy, Zap, Users, Mail, Phone, Award, Target, Rocket, Brain } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const HopeInfo = () => {
    const platforms = [
        { name: 'LeetCode', icon: '🔥' },
        { name: 'Skillrack', icon: '⚡' },
        { name: 'HackerRank', icon: '🏅' },
        { name: 'CodingNinjas', icon: '💻' },
        { name: 'GeeksforGeeks', icon: '📚' }
    ];

    const achievements = [
        'Microsoft & CodingNinjas Student Ambassadors',
        '1000+ LeetCode Problems Solved',
        'Hackathon & Coding Competition Winners',
        'SheCanCode - Women Coding Club'
    ];

    const features = [
        { icon: Brain, title: 'Elite Problem-Solving Training', desc: 'Advanced techniques and strategies' },
        { icon: Code, title: 'Master DSA', desc: 'Graphs, Trees, and Dynamic Programming' },
        { icon: Trophy, title: 'Interview Preparation', desc: 'Get ready for top IT companies' },
        { icon: Zap, title: 'Coding Challenges', desc: 'Hands-on competitions and contests' },
        { icon: Target, title: 'Personalized Mentorship', desc: 'One-on-one career guidance' },
        { icon: Users, title: 'Community Learning', desc: 'Collaborate with peers' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/hope-club.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center text-indigo-100 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex items-start gap-6 mb-6">
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                            <Code className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                                HOPE
                            </h1>
                            <p className="text-2xl md:text-3xl text-indigo-100 font-medium mb-4">
                                House of Programming Expertise
                            </p>
                            <p className="text-lg text-indigo-100 max-w-3xl">
                                Master Data Structures & Algorithms with Industry-Level Training!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join HOPE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Why Join HOPE? 🔥
                    </h2>
                    <p className="text-lg text-slate-600">Transform yourself into a world-class programmer</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-indigo-500">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                        <p className="text-sm text-slate-600">{feature.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Problem-Solving Platforms */}
            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Problem-Solving Platforms 💻
                        </h2>
                        <p className="text-lg text-slate-600">Leverage the best platforms to enhance your coding skills</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {platforms.map((platform, index) => (
                            <div key={index} className="bg-white rounded-xl px-6 py-4 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{platform.icon}</span>
                                    <span className="font-semibold text-slate-800">{platform.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications & Achievements */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Certifications & Achievements 📜
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                            <Award className="w-8 h-8 text-indigo-600 shrink-0" />
                            <p className="font-medium text-slate-800">{achievement}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch 📞</h2>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="w-5 h-5" />
                                <a href="mailto:hope@stjosephs.ac.in" className="text-lg hover:text-indigo-200 transition-colors">
                                    hope@stjosephs.ac.in
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <Phone className="w-5 h-5" />
                                <span className="text-lg">Mrs. Praba M - M.Tech (IT)</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link to="/resume">
                                <Button variant="secondary" className="text-lg px-8 py-3">
                                    Apply to HOPE <Rocket className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default HopeInfo;
