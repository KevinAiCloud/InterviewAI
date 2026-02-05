import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Building, GraduationCap, Presentation, Globe, Trophy, Mail, Phone, Cloud, Brain, Code, Shield, Atom, Link as LinkIcon, Bot, Car } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const PepInfo = () => {
    const features = [
        { icon: Building, title: 'Cutting Edge Infrastructure', desc: 'State-of-the-art learning facilities' },
        { icon: GraduationCap, title: 'Industry Certified Faculty', desc: 'Learn from the best in the field' },
        { icon: Code, title: 'Structured Curriculum', desc: 'Industry-designed learning path' },
        { icon: Presentation, title: 'Live & Immersive Classrooms', desc: '100% interactive sessions' },
        { icon: Users, title: 'Alumni Sessions', desc: 'Exclusive insights from successful graduates' },
        { icon: Trophy, title: 'Guest Lectures', desc: 'Industry experts share their knowledge' },
        { icon: Globe, title: 'Community Engagements', desc: 'Network with professionals' },
        { icon: Code, title: 'Inter-Domain Hackathons', desc: 'Compete and collaborate' }
    ];

    const clubs = [
        {
            icon: Cloud,
            name: 'AWS Cloud Computing & DevOps',
            highlights: [
                'AWS Academy Member | Microsoft Learn | Google Developer Club',
                'AWS Cloud Captain (Indian Region - 3rd Time!)',
                'Multi-Cloud Experts: AWS | Azure | Google Cloud'
            ],
            color: 'from-orange-500 to-yellow-500'
        },
        {
            icon: Brain,
            name: 'Artificial Intelligence & Machine Learning',
            highlights: [
                '60+ Computer Vision Developers',
                '80+ ML Experts'
            ],
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Code,
            name: 'Full Stack Development',
            highlights: [
                '65+ MERN Masters',
                '120+ React Rangers'
            ],
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Shield,
            name: 'Cyber Security',
            highlights: [
                'OSCP | CEH Certified',
                'Ethical Hacking & Pen Testing'
            ],
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: Atom,
            name: 'Quantum Computing',
            highlights: [
                'IBM Certified Students'
            ],
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: LinkIcon,
            name: 'Blockchain & Web3',
            highlights: [
                '10+ Projects Completed',
                '6+ Technology Stacks'
            ],
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Bot,
            name: 'Robotic Process Automation',
            highlights: [
                'UiPath Certified',
                '100+ Students Trained'
            ],
            color: 'from-slate-500 to-gray-500'
        },
        {
            icon: Car,
            name: 'EV Technology',
            highlights: [
                'Certified in EV Tech',
                'MOU with Industry Leaders'
            ],
            color: 'from-teal-500 to-cyan-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/pep-club.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex items-start gap-6 mb-6">
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                            <Users className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                                PEP
                            </h1>
                            <p className="text-2xl md:text-3xl text-blue-100 font-medium mb-4">
                                Placement Empowerment Programme
                            </p>
                            <p className="text-lg text-blue-100 max-w-3xl">
                                Master Industry Skills with 21 Cutting-Edge Domains
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Program Features 🔥
                    </h2>
                    <p className="text-lg text-slate-600">Everything you need to succeed in your career</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-blue-500">
                                <div className="text-center">
                                    <div className="inline-flex p-3 bg-blue-100 rounded-lg text-blue-600 mb-3">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Featured Clubs */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Featured Clubs 🌟
                        </h2>
                        <p className="text-lg text-slate-600">Explore our diverse technology domains</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club, index) => {
                            const Icon = club.icon;
                            return (
                                <Card key={index} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className={`inline-flex p-3 bg-gradient-to-r ${club.color} rounded-lg text-white mb-4`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3 text-lg">{club.name}</h3>
                                    <ul className="space-y-2">
                                        {club.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="text-blue-500 mt-1">✓</span>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch 📞</h2>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="w-5 h-5" />
                                <a href="mailto:placement@stjosephs.ac.in" className="text-lg hover:text-blue-200 transition-colors">
                                    placement@stjosephs.ac.in
                                </a>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-3">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-lg">Dr. B. Diwan - 99449 87560</span>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-lg">Mr. I.S. Merin SathyaDhas - 97909 11151</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link to="/resume">
                                <Button variant="secondary" className="text-lg px-8 py-3">
                                    Apply to PEP <Trophy className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default PepInfo;
