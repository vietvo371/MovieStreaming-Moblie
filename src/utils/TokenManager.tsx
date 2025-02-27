import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
}
export const saveUser = async (user: any) => {
    await AsyncStorage.setItem('user', user);
}
export const getUser = async () => {
    return await AsyncStorage.getItem('user');
}
export const getToken = async () => {
    return await AsyncStorage.getItem('token');
}

export const removeToken = async () => {
    await AsyncStorage.removeItem('token');
}

export const checkToken = async () => {
    const token = await getToken();
    return token ? true : false;
}