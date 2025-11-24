import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // This is crucial for sending cookies
});

export default axiosInstance;