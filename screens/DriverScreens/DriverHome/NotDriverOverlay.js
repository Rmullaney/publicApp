import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Overlay } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

const NotDriverOverlay = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlayContainer}
    >
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
            setIsVisible(false)
          }}
        >
          <Text style={styles.buttonText}>Become a Driver</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  )
}

export default NotDriverOverlay

const styles = StyleSheet.create({
  overlayContainer: {
    height: '40%',
    width: '70%',
    padding: '6%'
  },
  dummyImage: {
    height: '140%',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    marginTop: '-8%'
  },
  subContainer: {
    flex: 1,
    marginBottom: '2%'
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center'
  },
  subheaderText: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: '2%'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: '2%',
    paddingHorizontal: '20%',
    borderRadius: 20
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff'
  }
})