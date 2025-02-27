import { View } from "react-native";
import Toast from "react-native-toast-message";


export const DisplayMessage = (res: any) => {
    return (
        Toast.show({
            type: res.data.sub_type,
            text1: res.data.message,
        })
    );
};

export const DisplayError = (list_error: any) => {
    list_error.forEach((error: any) => {
        var message = error[0];
        Toast.show({
            type: 'error',
            text1: message,
        });
    });
};