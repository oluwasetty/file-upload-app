// Import axios library
import axios from 'axios';

// Create an instance of axios with custom configurations
const instance = axios.create({
    // Set the base URL for API requests
    baseURL: `${process.env.REACT_APP_API_URL}/`,
});

// Request interceptor to add authorization header to each request
instance.interceptors.request.use(config => {
    // Add authorization header with API key
    config.headers.Authorization = process.env.REACT_APP_API_KEY;
    return config;
}, error => {
    // Return a rejected promise if there's an error
    return Promise.reject(error);
});

// Response interceptor to handle responses
instance.interceptors.response.use(response => {
    // Resolve the promise with the response data
    return Promise.resolve(response);
}, error => {
    // Reject the promise if there's an error in the response
    return Promise.reject(error);
});

// Export the axios instance
export default instance;
