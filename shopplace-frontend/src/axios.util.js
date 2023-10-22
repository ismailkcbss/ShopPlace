import axios from "axios";
import * as storage from './storage.helper'

const axiosInstance = axios.create({
    headers: {
        "Access-Control-Allow-Origin": "http://localhost:5000",
    },
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            storage.setKeyWithValue("userdt", "");
            if (window.location.pathname !== '/Login')
                window.location.assign('/Login');
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

const setApiToken = (userdt) => {
    axiosInstance.defaults.headers.common['userdt'] = userdt;
};

export { axiosInstance, setApiToken };