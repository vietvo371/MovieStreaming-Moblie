import { View, Text, TextInput, StyleSheet } from "react-native";

export default function FormTextField({ label, value, onChangeText, errors = [], secureTextEntry = false }) {
    return (
        <View style={styles.container}>
            <Text>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
            {
                errors.map((error, index) => (
                    <Text key={index} style={styles.error}>{error}</Text>
                ))
            }
        </View>
    )
}   
const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
    }
})


