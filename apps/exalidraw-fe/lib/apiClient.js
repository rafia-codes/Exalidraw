import axios from 'axios';
import { HTTP_BACKEND, WS_URL} from '../config';

export const httpapiClient = axios.create({
    baseURL: `${HTTP_BACKEND}`,
    withCredentials: true
});

export const wsapiClient = axios.create({
    baseURL: `${WS_URL}`,
    withCredentials: true
})