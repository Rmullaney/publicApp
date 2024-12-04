import { View, Text, StyleSheet, Alert } from 'react-native'
import React, {useRef, useState, useEffect, useMemo, useCallback} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { auth, firestore } from '../../../API/firbaseConfig'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from "firebase/functions"
import { usePaymentSheet } from '@stripe/stripe-react-native'
import { DisplayImage } from '../../../API/imageMethods'

import Modal from 'react-native-modal'

import BottomSheet from '@gorhom/bottom-sheet';

const RiderInRideContent = ({ ride }) => {

  const [paid, setPaid] = useState(false);

  // //Start stripe code

  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    initializePaymentSheet();
    retrievePaymentMethods();
  }, [])

  const initializePaymentSheet = async () => {
    const functions = getFunctions();
    const fetchPSParams = httpsCallable(functions, 'fetchPSParams');

    const uid = auth.currentUser.uid;
    const { data } = await fetchPSParams({
      uid: uid,
      amount: ride.price,
    })

    const { error } = initPaymentSheet({
      customerId: data.customer,
      customerEphemeralKeySecret: data.ephemeralKey,
      paymentIntentClientSecret: data.paymentIntent,
      merchantDisplayName: 'Raider Rides',
      allowsDelayedPaymentMethods: true,

    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      // Alert.alert("paymentSheetInit Success");
      setReady(true)
    }
  }

  const retrievePaymentMethods = async () => {
    const functions = getFunctions();
    const listPaymentMethods = httpsCallable(functions, 'listPaymentMethods');

    const uid = auth.currentUser.uid;
    const { data } = await listPaymentMethods({
      uid: uid,
    })

    setPaymentMethods(Object.values(data.paymentMethodsData))
  }

  const buy = async () => {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        //setReady(true);
        Alert.alert("Payment Successful");
        setPaid(true);
      }
    } catch (error) {
      console.log("buy error: " + error);
    }
  }

  //End stripe code


  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['30%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  const pay = () => {
    buy();
  }

  const endRide = async () => {

    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const userData = await getDoc(userRef);

    const rideRef = doc(firestore, 'ride', userData.data().currRide);
    //const rideData = await getDoc(rideRef);

    if (ride.driver.driverId === auth.currentUser.uid) {
      updateDoc(rideRef, { 'driverDone': true });
    } else {
      updateDoc(rideRef, { ['riders.' + auth.currentUser.uid + '.riderDone'] : true });
    }
    updateDoc(userRef, { 'currRide': null });

  };

  return (
    // <Modal
    //   isVisible={true}
    //   style={styles.modal}
    //   backdropOpacity={0}
    // >
    <BottomSheet
    ref={bottomSheetRef}
    index={0}
    snapPoints={snapPoints}
    onChange={handleSheetChanges}
    style={{
      paddingHorizontal: '4%'
    }}
    backgroundStyle={{
      borderRadius: 30
    }}
    handleStyle={styles.bottomSheetHandle}
  >
      <View style={{width: '200%', marginLeft: 2}}>
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

      <View style={styles.infoContainer}>
        <View style={styles.innerInfoContainer}>
          <TouchableOpacity style={[styles.picture, { borderRadius: 31 }]}>
            <DisplayImage uid={ride.driver.driverId} iconSize={50} style={styles.imageJawn}/>
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



      <TouchableOpacity
        style={styles.finishButton}
        onPress={paid ? () => endRide() : () => pay()}
      >
        {paid ? <Text style={styles.finishButtonText}>Ride is Finished</Text> :
        <Text style={styles.finishButtonText}>Pay</Text>}
      </TouchableOpacity>

    </BottomSheet>
  )
}

export default RiderInRideContent

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 500,
    maxWidth: '45%'
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '-4%'
  },
  pillContainer: {
    flexDirection: 'row',
    marginLeft: '1.5%',
    marginVertical: '2%',
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
  finishButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: '2%',
    marginHorizontal: 24,
    borderRadius: 20
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 700
  },
  infoContainer: {
    flexDirection: 'row',
    paddingVertical: 7,
    marginBottom: 8
  },
  innerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '50%'
  },
  picture: {
    backgroundColor: '#f2f2f2',
    height: 62,
    width: 62,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageJawn: {
    width: 62,
    height: 62,
    borderRadius: 15,
  },
  driverNameText: {
    padding: 6,
    maxWidth: '70%',
    fontSize: 16
  },
  carInfoContainer: {
    padding: 6,
    alignItems: 'flex-end'
  },
  carText: {
    fontSize: 12
  },
  licenseText: {
    fontSize: 16,
    fontWeight: 500
  },
  bottomSheetHandle: {
    opacity: 0
  }
})