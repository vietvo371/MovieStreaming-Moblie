import axios from "axios";
import { getToken, saveToken } from "./TokenManager";
import Toast from "react-native-toast-message";

// const baseUrl = 'http://192.168.20.20:8000/api';
const baseUrl = 'http://192.168.1.130:8000/api';
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
    // (error) => {
    //     if (error.response) {
    //         console.log(error.response);
    //         switch (error.response.status) {
    //             case 401:
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Phiên đăng nhập hết hạn',
    //                     text2: 'Vui lòng đăng nhập lại'
    //                 });
    //                 break;
    //             case 402:
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Yêu cầu nâng cấp',
    //                     text2: 'Vui lòng nâng cấp tài khoản'
    //                 });
    //                 break;
    //             case 403:
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Không có quyền truy cập',
    //                     text2: error.response.data.message
    //                 });
    //                 break;
    //             case 422:
    //                 const errors = error.response.data.errors;
    //                 if (errors) {
    //                     const firstError = Object.values(errors)[0];
    //                     Toast.show({
    //                         type: 'error',
    //                         text1: 'Lỗi dữ liệu',
    //                         text2: Array.isArray(firstError) ? firstError[0] : firstError
    //                     });
    //                 }
    //                 break;
    //             default:
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Lỗi',
    //                     text2: error.response.data.message || 'Có lỗi xảy ra, vui lòng thử lại'
    //                 });
    //         }
    //     } else if (error.request) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Lỗi kết nối',
    //             text2: 'Không thể kết nối đến máy chủ'
    //         });
    //     } else {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Lỗi',
    //             text2: 'Có lỗi xảy ra, vui lòng thử lại'
    //         });
    //     }
    //     return Promise.reject(error);
    // }
);

export { api, baseUrl };