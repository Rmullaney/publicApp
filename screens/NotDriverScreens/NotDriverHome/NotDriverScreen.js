import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NotDriverScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={[styles.subContainer, styles.headerContainer]}>
          <Text style={styles.headerText}>Drive, Earn, and Explore with Raider Rides!</Text>
          <Text style={styles.subheaderText}>Apply today to start driving</Text>
        </View>

        <View style={[styles.subContainer, styles.imageContainer]}>
          <TouchableOpacity style={styles.dummyImage}></TouchableOpacity>
        </View>

        <View style={[styles.subContainer, styles.buttonContainer]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('DriverSignUp')
            }}
          >
            <Text style={styles.buttonText}>Become a Driver!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: '6%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    height: '50%',
    width: '70%',
    padding: '6%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    justifyContent: 'space-between'
  },
  imageContainer: {
    flex: 3,
    marginVertical: '10%'
  },
  dummyImage: {
    // height: '76%',
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    // marginTop: '-8%'
  },
  subContainer: {
    // height: '30%',
    marginBottom: '2%'
  },
  headerContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center'
  },
  subheaderText: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: '2%'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: '5%',
    paddingHorizontal: '20%',
    borderRadius: 15
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff'
  },
  checkmark: {
    position: 'absolute',
    top: 40, // Adjust the position as needed
    left: 55, // Adjust the position as needed
},
});
