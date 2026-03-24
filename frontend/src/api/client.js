import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const createLink = async (targetUrl) => {
    const response = await api.post('/api/v1/links', { targetUrl });
    return response.data;
}
  
export const getAllLinks = async () => {
    const response = await api.get('/api/v1/links');
    return response.data;
}

export const getAnalytics = async (id) => {
    const response = await api.get(`/api/v1/links/${id}/analytics`);
    return response.data;
}
