import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View,Image } from 'react-native';
import styles from './styles';

const SPage = () => {
    return (
    <View style={styles.container}>
      <Image source={require('../../assets/RaiderRidesLogo.png')} style={styles.logo} />
      <Text style = {styles.subtitle}>
        Powered By Sloop
      </Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default SPage;

