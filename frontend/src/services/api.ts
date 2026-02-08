import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5003',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }

});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('API Interceptor: Original headers:', config.headers);
    console.log('API Interceptor: Token found:', !!token);

    // Check if this is a public route that doesn't need authentication
    const publicRoutes = [
        '/categories',
        '/products',
        '/districts'
    ];

    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));

    if (token && !isPublicRoute) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API Interceptor: Added Authorization header for authenticated route');
    } else if (isPublicRoute) {
        console.log('API Interceptor: Public route detected, skipping Authorization header');
    } else {
        console.log('API Interceptor: No token found, not adding Authorization header');
    }
    return config;
})


export default api;
