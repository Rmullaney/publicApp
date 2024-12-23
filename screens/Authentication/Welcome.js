import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Welcome({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Welcome screen!</Text>
      <View style={styles.buttons}>
        <Button title="Sign in" buttonStyle={styles.button} onPress={() => navigation.navigate('Sign In')} />
        <Button title="Sign up" type="outline" buttonStyle={styles.button} onPress={() => navigation.navigate('Sign Up')} />
      </View>
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
  buttons: {
    flex: 1,
  },
  button: {
    marginTop: 10
  }
});