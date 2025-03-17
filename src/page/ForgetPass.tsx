import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForgetPass() {
    return (
        <View style={styles.container}>
            <Text>ForgetPass</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});