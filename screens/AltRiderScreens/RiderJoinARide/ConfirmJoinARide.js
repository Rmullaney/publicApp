import { StyleSheet, Text, View, Image } from 'react-native'
import React, { isValidElement, useState } from 'react'
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ConfirmJoinARide = ({ ride, toggleJoinARideConfirmation, toggleJoinARideModal})=> {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(ride.pickupDate)

  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear()

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  return (
    <SafeAreaView style={styles.container}>
      <Overlay
        isVisible={true}
        backdropStyle={{
          opacity: opacityVal
        }}
        overlayStyle={styles.overlay}
      >
        <View style={styles.headerContainer}>
          <Text
            style={styles.headerText}

          >
            You joined a ride!
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            You have been added to the ride from {ride.pickupLocation.substring(0, ride.pickupLocation.indexOf(","))} to {ride.dropoffLocation.substring(0, ride.dropoffLocation.indexOf(","))} on {month} {day}, {year} at {hours}:{min < 10 && 0}{min}{amOrPm}.
          </Text>
          <Text></Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={require('../../../assets/redcar.png')} style={styles.image} />
        </View>

        <View style={styles.okayContainer}>
          <TouchableOpacity
            style={styles.okayButton}
            onPress={() => {
              // toggleJoinARideConfirmation()
              toggleJoinARideModal()
            }}
          >
            <Text style={styles.okayButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>

      </Overlay>

      <ConfettiCannon
        count={300}
        origin={{ x: 0, y: 0 }}
        fadeOut={true}
        colors={['red', '#f2f2f2', 'brightred', '#d9d9d9']}
      />
    </SafeAreaView>
  )
}

export default ConfirmJoinARide

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  overlay: {
    padding: '4%',
    height: '40%',
    width: '70%',
    borderRadius: 20
  },
  // headerContainer: {
  //   flex: 1
  // },
  headerText: {
    fontSize: 22,
    fontWeight: 700,
    color: 'red',
    textAlign: 'center'
  },
  infoContainer: {
    flex: 1,
    paddingVertical: '4%'
  },
  infoText: {
    fontWeight: 400,
    fontSize: 15
  },
  // okayContainer: {
  //   flex: .5,
  //   justifyContent: 'flex-end'
  // },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%'
  },
  okayButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: '4%',
    borderRadius: 20,
  },
  okayButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 700
  },
})