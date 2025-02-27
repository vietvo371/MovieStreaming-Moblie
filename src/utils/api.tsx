import axios from "axios";
import { getToken, saveToken } from "./TokenManager";
import { DisplayError } from "../../general/Notification";
import Toast from "react-native-toast-message";

const baseUrl = 'http://192.168.1.131:8000/api';
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const newToken = response.headers['authorization'];
        if (newToken) {
            saveToken(newToken);
        }
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.data && error.response.data.errors) {
                DisplayError(error.response.data.errors.message);
            } else if (error.response.data && error.response.data.message) {
                DisplayError(error.response.data.message);
            } else {
                Toast.show({
                    text1: 'Có lỗi xảy ra, vui lòng thử lại sau',
                    type: 'error',
                });
            }
        } else if (error.request) {
            Toast.show({
                text1: 'Không thể kết nối đến máy chủ',
                type: 'error',
            });
        } else {
            Toast.show({
                text1: 'Có lỗi xảy ra, vui lòng thử lại sau',
                type: 'error',
            });
        }
        return Promise.reject(error);
    }
);

export default api;