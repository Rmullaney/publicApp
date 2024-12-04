import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { auth, firestore } from '../../../API/firbaseConfig'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import RiderInfo from './RiderInfo'

import BottomSheet from '@gorhom/bottom-sheet';

const DriverInRideContent = ({ ride }) => {
  const riders = Object.values(ride.riders);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  let date;
  if (ride.pickupDate.seconds !== undefined){
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

  const endRide = async () => {

    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const userData = await getDoc(userRef);

    const rideRef = doc(firestore, 'ride', userData.data().currRide);
    //const rideData = await getDoc(rideRef);

    if (ride.driver.driverId === auth.currentUser.uid) {
      await updateDoc(rideRef, { 'driverDone': true });
    } else {
      await updateDoc(rideRef, { 'riderDone': true });
    }
    await updateDoc(userRef, { 'currRide': null });

  };

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '20%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      style={{
        paddingHorizontal: '4%'
      }}
      backgroundStyle={{
        borderRadius: 30
      }}
    >
      <View style={styles.headerContainer}>
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

      <View style={styles.pillContainer}>
        <View style={styles.pill}>
          <Ionicons name="calendar" size={12} color="black" style={{ marginRight: 5 }} />
          <Text style={styles.pillText}>
            {`${month} ${day}, ${year}`}
          </Text>
        </View>

        <View style={styles.pill}>
          <MaterialCommunityIcons name="clock" size={12} color="black" style={{ marginRight: 5 }} />
          <Text style={styles.pillText}>
            {`${hours}:${min < 10 ? 0 : ''}${min}${amOrPm}`}
          </Text>
        </View>

        <View style={styles.pill}>
          <Ionicons name="people" size={12
          } color="black" style={{ marginRight: 5 }} />
          <Text style={styles.pillText}>
            {ride.numOfRiders}
          </Text>
        </View>
      </View>

      <View style={styles.finishButtonContainer}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => endRide()}
        >
          <Text style={styles.finishButtonText}>Ride is Finished</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ridersContainer}>
        <Text style={styles.ridersText}>Riders</Text>
        <FlatList
          data={riders}
          keyExtractor={(item) => {
            return item.key;
          }}
          renderItem={({ item }) => {
            return <RiderInfo user={item} ride={ride}/>
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* <View style={styles.infoContainer}>
        <View style={styles.innerInfoContainer}>
          <TouchableOpacity style={[styles.picture, { borderRadius: 31 }]}>
            <Text>Driver Pic</Text>
          </TouchableOpacity>
          <Text style={styles.driverNameText} numberOfLines={1}>{ride.driver.firstName} {ride.driver.lastName.charAt(0)}. </Text>
        </View>

        <View style={[styles.innerInfoContainer, { justifyContent: 'flex-end' }]}>
          <View style={styles.carInfoContainer}>
            <Text style={styles.carText}>{ride.driver.car.make} {ride.driver.car.model}</Text>
            <Text style={styles.licenseText}>{ride.driver.car.licensePlate}</Text>
          </View>

          <TouchableOpacity style={styles.picture}>
            <Text>Car Pic</Text>
          </TouchableOpacity>
        </View>
      </View>

 */}
    </BottomSheet>
  )
}

export default DriverInRideContent

const styles = StyleSheet.create({
  container: {
    height: '40%',
    paddingHorizontal: '5%',
    paddingTop: '6%',
    backgroundColor: 'white',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    marginTop: '-8%',
    backgroundColor: '#fff'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 500,
    maxWidth: '45%'
  },
  headerContainer: {
    marginBottom: '2%',
    width: '200%',
    // height: '14%',
  },
  pillContainer: {
    flexDirection: 'row',
    marginLeft: '1.5%',
    marginBottom: '3%',
    // height: '8%'
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingHorizontal: '2%',
    paddingVertical: '1.5%',
    borderRadius: 30,
    marginRight: '1.5%',
    alignItems: 'center'
  },
  pillText: {
    fontSize: 12
  },
  ridersContainer: {
    padding: '1%'
  },
  finishButtonContainer: {
    marginBottom: '5%'
  },
  finishButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: '2%',
    marginHorizontal: '6%',
    borderRadius: 20
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 700
  },
  ridersText: {
    fontWeight: 500,
    fontSize: 18,
  }
  // infoContainer: {
  //   flexDirection: 'row',
  //   paddingVertical: 7,
  //   marginBottom: 8
  // },
  // innerInfoContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   width: '50%'
  // },
  // picture: {
  //   backgroundColor: '#f2f2f2',
  //   height: 62,
  //   width: 62,
  //   borderRadius: 15,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  // driverNameText: {
  //   padding: 6,
  //   maxWidth: '70%',
  //   fontSize: 16
  // },
  // carInfoContainer: {
  //   padding: 6,
  //   alignItems: 'flex-end'
  // },
  // carText: {
  //   fontSize: 12
  // },
  // licenseText: {
  //   fontSize: 16,
  //   fontWeight: 500
  // },
})