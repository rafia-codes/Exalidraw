'use client'
import axios from 'axios';
import { HTTP_BACKEND, WS_URL} from '../config';

export const httpapiClient = axios.create({
    baseURL: `${HTTP_BACKEND}`,
    withCredentials: true
});

httpapiClient.interceptors.request.use((config)=>{
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem('token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
})

export const wsapiClient = axios.create({
    baseURL: `${WS_URL}`,
    withCredentials: true
})