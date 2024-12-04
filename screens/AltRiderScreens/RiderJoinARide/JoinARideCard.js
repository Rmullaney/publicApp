import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import {auth, firestore} from '../../../API/firbaseConfig'
import { Entypo } from '@expo/vector-icons';

const JoinARideCard = ({ ride, active, toggleJoinARideConfirmation }) => {
  // console.log(ride);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  const date = new Date(Date.parse(ride.pickupDate))
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthString(date.getMonth());

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  const pickupRideEndIndex = ride.pickupLocation.indexOf(",") > 0 ? ride.pickupLocation.indexOf(",") : ride.pickupLocation.length;
  const dropoffRideEndIndex = ride.dropoffLocation.indexOf(",") > 0 ? ride.dropoffLocation.indexOf(",") : ride.dropoffLocation.length

  const addRider = () => {
    Alert.alert(
      "Confirm ride",
      `Are you sure that you would like to join this ride?`,
      [
        {
          text: "No",
          onPress: () => console.log("no Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => { addRiderTodatabase() } },
      ]
    );
  }

  const addRiderTodatabase = async () => {
    const data = {}
    const userRef = doc(firestore, 'users', `${auth.currentUser.uid}`)
    const user = await getDoc(userRef);
    data[`riders.${auth.currentUser.uid}`] = {
      dateOfBirth: user.data().dateOfBirth,
      driver: { isDriver: user.data().driver.isDriver },
      email: user.data().email,
      firstName: user.data().firstName,
      lastName: user.data().lastName,
    }
    const ridedocRef = doc(firestore, 'ride', ride.key);
    await updateDoc(ridedocRef, {
      numOfRiders: increment(1),
      price: ride.price * 0.80,
      ...data
    }).then(() => {
      toggleJoinARideConfirmation(ride)
    })
  }

  return (
    <Pressable onPress={() => addRider()} style={active ? styles.activeContainer : styles.container}>
      <View style={styles.locationContainer}>
        <Text
          style={styles.dropoffText}
          numberOfLines={2}
        >
          {ride.pickupLocation.substring(0, pickupRideEndIndex)}
          <Text> to </Text>
          {ride.dropoffLocation.substring(0, dropoffRideEndIndex)}
        </Text>

        <View style={styles.pickupLocationContainer}>
          <Text style={styles.subText}>{month} {day}, {hours}:{min < 10 && 0}{min} {amOrPm}</Text>
          <Entypo name="dot-single" size={20} color="black" />
          <Text>
            {4 - ride.numOfRiders} seats available
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.priceText}>${ride.money?.pricePerRider}</Text>
      </View>
    </Pressable>
  )
}

export default JoinARideCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '5%',
    // borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    // borderTopColor: '#d9d9d9',
    borderBottomColor: '#d9d9d9',
    paddingHorizontal: '2%'
  },
  activeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '5%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
    // borderTopWidth: 0.5,
    // borderTopColor: '#d9d9d9',
    borderLeftColor: 'red',
    borderLeftWidth: 6,
    paddingHorizontal: '4%',
  },
  locationContainer: {
    maxWidth: '80%'
  },
  dropoffText: {
    fontSize: 17,
    fontWeight: 500
  },
  pickupLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%'
  },
  priceText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500
  }
})