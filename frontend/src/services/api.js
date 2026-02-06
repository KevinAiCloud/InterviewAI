import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadResume = async (formData) => {
    try {
        const response = await api.post('/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to upload resume' };
    }
};

export const uploadVideo = async (formData) => {
    try {
        const response = await api.post('/api/video/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to upload video' };
    }
};

export const getQuestions = async () => {
    try {
        const response = await api.get('/get_questions');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch questions' };
    }
};

const ASSESSMENT_API_URL = 'http://localhost:8003'; // Direct to assessment service

const assessmentApi = axios.create({
    baseURL: ASSESSMENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const startAssessment = async (jobDescription) => {
    try {
        const response = await assessmentApi.post('/start', { job_description: jobDescription });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to start assessment' };
    }
};

export const submitAssessment = async (sessionId, answers) => {
    try {
        const response = await assessmentApi.post('/submit', { session_id: sessionId, answers });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit assessment' };
    }
};

export default api;
