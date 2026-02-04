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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hope" element={<HopeInfo />} />
            <Route path="/pep" element={<PepInfo />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/video" element={<VideoInterview />} />
            <Route path="/quiz" element={<McqQuiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
