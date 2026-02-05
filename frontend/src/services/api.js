import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadResume = async (formData) => {
    try {
        const response = await api.post('/api/resume/upload', formData, {
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

export default api;
