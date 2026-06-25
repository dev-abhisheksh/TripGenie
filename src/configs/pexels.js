import axios from "axios";

const pexels = axios.create({
    baseURL: "https://api.pexels.com/v1",
});

pexels.interceptors.request.use((config) => {
    config.headers.Authorization = process.env.PEXELS_API_KEY;
    return config;
});

export default pexels;