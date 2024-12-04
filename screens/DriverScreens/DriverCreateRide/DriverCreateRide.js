import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//sample to make expo go work
export default function DriverCreateRide() {
    return (
        <View style={styles.container}>
            <Text>DriverCreateRide!</Text>
            <StatusBar style="auto"/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});