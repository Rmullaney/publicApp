import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { firestore, auth } from '../../../../API/firbaseConfig';

const JoinARideCard = ({ ride }) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  const seconds = ride.pickupDate.seconds
  const date = new Date(seconds * 1000)
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthString(date.getMonth());
  const year = date.getFullYear()

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

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
      ...data });
  }

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => addRider()} style={styles.box}>
        <View style={{ width: '80%' }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text
              style={styles.headerText}
              numberOfLines={2}
            >
              {ride.pickupLocation.substring(0, ride.pickupLocation.indexOf(","))}
              <Text> </Text>
              <MaterialCommunityIcons name="car-hatchback" size={18} color="red" />
              <Text> </Text>
              {ride.dropoffLocation?.substring(0, ride.dropoffLocation.indexOf(","))}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={styles.pill}>
              <Ionicons name="calendar" size={13} color="black" style={{ marginRight: 5 }} />
              <Text style={styles.pillText}>
                {`${month} ${day}, ${year}`}
              </Text>
            </View>

            <View style={styles.pill}>
              <MaterialCommunityIcons name="clock" size={13} color="black" style={{ marginRight: 5 }} />
              <Text style={styles.pillText}>
                {`${hours}:${min < 10 ? 0 : ''}${min}${amOrPm}`}
              </Text>
            </View>

            <View style={styles.pill}>
              <Ionicons name="people" size={13} color="black" style={{ marginRight: 5 }} />
              <Text style={styles.pillText}>
                {ride.numOfRiders}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.costContainer}>
          <Text style={styles.costText}>${ride.price}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default JoinARideCard

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
    padding: 8,
    borderRadius: 15
  },
  bodyText: {
    fontSize: 14,
    fontWeight: 500,
    maxWidth: '45%'
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 30,
    marginRight: 6
  },
  pillText: {
    fontSize: 11
  },
  costContainer: {
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%'
  },
  costText: {
    fontSize: 16,
    fontWeight: 500,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 500
  }
});