import { StyleSheet, Text, View, Image, Overlay } from 'react-native'
import React, { isValidElement, useState } from 'react'
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ConfirmRideCreationOverlay = ({ naivgation, ride, toggleRideCreationConfirmation}) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(ride.pickupDate)

  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear()

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  const pickupRideEndIndex = ride.pickupLocation.indexOf(",") > 0 ? ride.pickupLocation.indexOf(",") : ride.pickupLocation.length;
  const dropoffRideEndIndex = ride.dropoffLocation.indexOf(",") > 0 ? ride.dropoffLocation.indexOf(",") : ride.dropoffLocation.length

  return (
    <SafeAreaView style={styles.container}>
      <Overlay
        isVisible={true}
        backdropStyle={{
          opacity: 1
        }}
        overlayStyle={styles.overlay}
      >
        <View style={styles.headerContainer}>
          <Text
            style={styles.headerText}

          >
            Your ride request has been created!
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Ride from {ride.pickupLocation.substring(0, pickupRideEndIndex)} to {ride.dropoffLocation.substring(0,dropoffRideEndIndex)} on {month} {day}, {year} at {hours}:{min < 10 && 0}{min}{amOrPm} has been requested.
          </Text>
          <Text></Text>
          <Text style={styles.infoText}>
            You will be notified when a driver claims your ride.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={require('../../../assets/redcar.png')} style={styles.image} />
        </View>

        <View style={styles.okayContainer}>
          <TouchableOpacity
            style={styles.okayButton}
            onPress={() => {
              toggleRideCreationConfirmation()
              naivgation.goBack()
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

export default ConfirmRideCreationOverlay

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
    paddingVertical: '2%',
    borderRadius: 20,
  },
  okayButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 700
  },
})