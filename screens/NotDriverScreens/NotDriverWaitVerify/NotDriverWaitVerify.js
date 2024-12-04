import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { DisplayImageComponent } from '../../../API/imageMethods';

export default function NotDriverWaitVerify() {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    {"\n\n\n"}Your application has been submitted for a review!
                </Text>
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name="document" size={250} color="white" style={styles.document} />
                <Ionicons name="checkmark" size={200} color="darkred" style={styles.checkmark} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.description}>
                    Our team will contact you as soon as your application has been processed
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'darkred',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',

    },
    description: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        // flex: 1,
    },
    document: {
        flex:1,
        top: 100,
    },
    checkmark: {
        position: 'absolute',
        top: 175, // Adjust the position as needed
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: -0.5, // Adjust the flex value as needed
    },
    textContainer: {
        flex: 0, // Set to 0 to place at the top of the screen
    },
});
