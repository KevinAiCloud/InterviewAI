import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HopeInfo from '../pages/HopeInfo';
import PepInfo from '../pages/PepInfo';
import ResumeUpload from '../pages/ResumeUpload';
import VideoInterview from '../pages/VideoInterview';
import McqQuiz from '../pages/McqQuiz';
import Result from '../pages/Result';
import NotFound from '../pages/NotFound';
import Login from '../auth/Login';
import Admin from '../pages/Admin';
import RequireAuth from '../auth/RequireAuth';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hope" element={<HopeInfo />} />
            <Route path="/pep" element={<PepInfo />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/video" element={<VideoInterview />} />
            <Route path="/quiz" element={<McqQuiz />} />
            <Route path="/result" element={<Result />} />

            {/* Protected Admin Route */}
            <Route
                path="/admin"
                element={
                    <RequireAuth adminOnly={true}>
                        <Admin />
                    </RequireAuth>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;

