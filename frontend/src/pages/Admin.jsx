import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { Users, FileText, Video, CheckSquare, Search, Filter, Shield } from 'lucide-react';
import Card from '../components/Card';
import Loader from '../components/Loader';

const Admin = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, resume, video, assessment

    useEffect(() => {
        // Fetch users (real-time not strictly necessary for users list, but good for scores)
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersList = usersSnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        // Real-time listener for scores
        const unsubscribe = onSnapshot(query(collection(db, "scores"), orderBy("timestamp", "desc")), (snapshot) => {
            const scoresList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()
            }));
            setScores(scoresList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching scores:", error);
            setLoading(false);
        });

        fetchUsers();

        return () => unsubscribe();
    }, []);

    const getScoreColor = (score, type) => {
        let maxScore = 10;
        if (type === 'assessment') maxScore = 100; // Assuming assessment is out of 100 or has more questions

        const percentage = (score / maxScore) * 100;

        if (percentage >= 70) return 'text-green-600 bg-green-50 border-green-200';
        if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'resume': return <FileText className="w-4 h-4 text-blue-500" />;
            case 'video': return <Video className="w-4 h-4 text-purple-500" />;
            case 'assessment': return <CheckSquare className="w-4 h-4 text-emerald-500" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const filteredScores = scores.filter(score => {
        const matchesSearch = score.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || score.type === filter;
        return matchesSearch && matchesFilter;
    });

    const userMap = users.reduce((acc, user) => {
        acc[user.uid] = user;
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                            <Shield className="w-8 h-8 text-purple-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Monitor user progress and assessment results
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900">{users.length}</span>
                            <span className="text-slate-500 ml-1">Total Users</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <div className="text-sm">
                            <span className="font-bold text-slate-900">{scores.length}</span>
                            <span className="text-slate-500 ml-1">Total Activities</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                            {['all', 'resume', 'video', 'assessment'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scores Table */}
                    <Card className="overflow-hidden border-0 shadow-lg bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wider">User</th>
                                        <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Activity Type</th>
                                        <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Score</th>
                                        <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Details</th>
                                        <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredScores.length > 0 ? (
                                        filteredScores.map((score) => (
                                            <tr key={score.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 text-slate-900 font-medium whitespace-nowrap">
                                                    {score.email}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-slate-600 capitalize">
                                                        {getTypeIcon(score.type)}
                                                        {score.type}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(score.score, score.type)}`}>
                                                        {score.score !== undefined ? score.score : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
                                                    {score.type === 'resume' && score.details?.fileName}
                                                    {score.type === 'video' && `Audio: ${score.details?.audioScore}/10`}
                                                    {score.type === 'assessment' && `Total Qs: ${score.details?.totalQuestions}`}
                                                </td>
                                                <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                                                    {score.timestamp ? score.timestamp.toLocaleDateString() + ' ' + score.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending...'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">
                                                No activities found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Admin;
