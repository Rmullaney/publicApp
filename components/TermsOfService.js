import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
// import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const TermsOfService = ({ navigation }) => {

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-sharp" size={34} color="black" />
      </TouchableOpacity>
      <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/raider-rides-app.appspot.com/o/images%2FtermsOfService%2FTOS_example.jpeg?alt=media&token=df7183b1-7956-4c92-b3c9-e4631cd47545&_gl=1*ibpi4g*_ga*MTE5NDQ5NjEyNi4xNjg0NzM1OTQ3*_ga_CW55HF8NVT*MTY5ODE4MzY2Ny4yMTIuMS4xNjk4MTg0MzU2LjkuMC4w' }} />
      <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/raider-rides-app.appspot.com/o/images%2FtermsOfService%2FTOS_example.jpeg?alt=media&token=df7183b1-7956-4c92-b3c9-e4631cd47545&_gl=1*ibpi4g*_ga*MTE5NDQ5NjEyNi4xNjg0NzM1OTQ3*_ga_CW55HF8NVT*MTY5ODE4MzY2Ny4yMTIuMS4xNjk4MTg0MzU2LjkuMC4w' }} />
    </ScrollView>
  )
}

export default TermsOfService

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerContent: {
    justifyContent: 'center',
    padding: '4%'
  },
  image: {
    height: 470,
    width: '100%',
  }
})