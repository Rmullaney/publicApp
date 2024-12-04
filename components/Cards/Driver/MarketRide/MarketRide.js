import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, getDoc, collection, query, getDocs, where } from 'firebase/firestore';
import { firestore, auth } from '../../../../API/firbaseConfig';

const MarketRide = ({ ride }) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  let date;
  if (ride.pickupDate.seconds !== undefined) {
    const seconds = ride.pickupDate.seconds;
    date = new Date(seconds * 1000);
  } else {
    date = new Date(ride.pickupDate);
  }
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthString(date.getMonth());
  const year = date.getFullYear()


  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  const getDriverInfo = async () => {
    const userRef = doc(firestore, 'users', `${auth.currentUser.uid}`)
    const user = await getDoc(userRef)

    const userInfo = {
      driverId: auth.currentUser.uid,
      firstName: user.data().firstName,
      lastName: user.data().lastName,
      phoneNumber: user.data().phoneNumber,
      car: user.data().driver.car,
    }

    return userInfo
  }

  const addDriverToRide = async () => {
    const rideDocRef = doc(firestore, 'ride', ride.key);
    const driver = await getDriverInfo();
    try {
      await updateDoc(rideDocRef, { driver, status: 'upcoming' })
    } catch (error) {
      console.log(error)
    }
  }

  const addTimeToDate = (date, mins) => {
    // console.log("min:", min)
    const temp = new Date(date);
    // console.log("temp:", temp);
    temp.setTime(temp.getTime() - (30 * 60 * 1000));
    console.log("temp after:", temp);
    return temp;
  }

  const checkConflict = async () => {
    // The start and end bounds of the ride driver wants to claim
    const dur = ride.duration ? ride.duration : 0;
    // console.log("ride pickupdate: " + ride.pickupDate);
    // console.log(new Date(ride.pickupDate))
    const startBound = addTimeToDate(ride.pickupDate)
    const endBound = addTimeToDate(ride.pickupDate, 30 + dur);
    console.log("------------")
    console.log("startbound:", startBound)
    console.log("endbound:", endBound)

    // get all upcoming rides with driver 
    const q = query(collection(firestore, "ride"), where("driver.driverId", "==", auth.currentUser.uid));

    var hasConflict = false;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.data())
      // console.log("pickupdate", doc.data().pickupLocation)
      // console.log(auth.currentUser.uid)
      const checkDur = doc.data().duration ? doc.data().duration : 0;
      const checkStart = new Date(doc.data().pickupDate);
      const checkEnd = addTimeToDate(doc.data().pickupDate, checkDur);
      console.log("checkStart:", checkStart)
      console.log("checkend:", checkEnd)

      console.log("both less than start:", checkStart < startBound && checkEnd < startBound)
      console.log("both greater than end:", checkStart > endBound && checkEnd > endBound)
      console.log("bother together", !(checkStart < startBound && checkEnd < startBound) && !(checkStart > endBound && checkEnd > endBound))

      if (!(checkStart < startBound && checkEnd < startBound) && !(checkStart > endBound && checkEnd > endBound)) {
        // console.log("in if statement")
        hasConflict = true
      }
    });

    return hasConflict;
  }

  const addDriver = async () => {
    // console.log("in add driver")
    const temp = await checkConflict();
    console.log("check conflict", temp)
    // .then((hasConflict) => {
    //   console.log("hasConflict", hasConflict)
    //   {
    //     hasConflict ?
    //       (
    //         Alert.alert(
    //           "Ride Conflict",
    //           "This ride overlaps with one of your existing ride.",
    //           [
    //             {
    //               text: "Okay",
    //             },
    //           ]
    //         )
    //       )
    //       : (
    //         Alert.alert(
    //           "Confirm ride",
    //           "Are you sure that you would like to be added to this ride?",
    //           [
    //             {
    //               text: "No",
    //               onPress: () => console.log("no Pressed"),
    //               style: "cancel",
    //             },
    //             { text: "Yes", onPress: () => { addDriverToRide() } },
    //           ]
    //         )
    //       )
    //   }
    // })
  }

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={addDriver} style={styles.box}>
        <View style={{ width: '80%' }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text
              style={styles.headerText}
              numberOfLines={2}
            >
              {ride.pickupLocation}
              <Text> </Text>
              <MaterialCommunityIcons name="car-hatchback" size={18} color="red" />
              <Text> </Text>
              {ride.dropoffLocation}
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
          {ride.money === undefined || ride.money.driverProfit === undefined ?
            <Text style={styles.costText}>$50</Text> :
            <Text style={styles.costText}>${Math.ceil(ride.money.driverProfit)}</Text>
          }
        </View>
      </Pressable>
    </View>
  )
}

export default MarketRide

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 3,
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
    fontSize: 12
  },
  costContainer: {
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%'
  },
  costText: {
    fontSize: 20,
    fontWeight: 700,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 500
  }
});