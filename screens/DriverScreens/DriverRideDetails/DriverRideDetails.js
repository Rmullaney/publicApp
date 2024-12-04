import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import DriverRideDetailsMap from './DriverRideDetailsMap'
import DriverInfoCard from './DriverInfoCard'
import { auth, firestore } from '../../../API/firbaseConfig'
import { deleteField, updateDoc, doc } from 'firebase/firestore'

// const dummyData = [
//   {
//     firstName: 'jane',
//     lastName: 'doe'
//   },
//   {
//     firstName: 'john',
//     lastName: 'foe'
//   }
// ]

export const DriverRideDetails = ({ ride, setShowModal, navigation }) => {
  // Sets visibility of modal
  const [isVisible, setIsVisible] = useState(true);

  // Turns object into an array to be used as data in the flatlist 
  const riders = Object.values(ride.riders);

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

  // Sends an alert to user confirming the cancellation of the ride
  const confirmRideCanceled = () => {
    // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // const monthString = (monthNum) => {
    //   return monthNames[monthNum]
    // }

    // const hours = ride.pickupDate.getHours() > 12 ? ride.pickupDate.getHours() - 12 : ride.pickupDate.getHours()
    // const min = ride.pickupDate.getMinutes()
    // const day = ride.pickupDate.getDate()
    // const month = monthString(ride.pickupDate.getMonth());
    // const year = ride.pickupDate.getFullYear()

    // const amOrPm = ride.pickupDate.getHours() >= 12 ? 'pm' : 'am'

    //Ride from ${pickupLocation} to ${dropoffLocation} on ${month} ${day}, ${year} at ${hours}:${min < 10 ? 0 : ''}${min}${amOrPm} has been canceld. 
    Alert.alert(
      'Ride Canceled',
      `Thank you for choosing Raider Rides.`,
      [
        {
          text: "Okay",
          onPress: () => console.log("pressed Okay"),
        },
      ]
    );
  }

  // Modify the ride in the database
  const cancelRideInDatabase = async () => {
    // Create an initial document to update.
    const rideDocRef = doc(firestore, 'ride', `${ride.key}`);

    try {
      await updateDoc(rideDocRef, {
        'status': 'pendingDriver',
        driver: {}
      });
    } finally {
      setIsVisible(false)
      confirmRideCanceled()
    }
  }

  // Asks user to confirm cancellation of the ride
  // No --> ride is not canceled
  // Yes --> ride is canceled, info sent to firestore, alert user with confirmation that ride was canceled
  const cancelRide = () => {
    Alert.alert(
      "Confirm ride cancellation",
      "Are you sure that you would like to cancel this ride?",
      [
        {
          text: "No",
          onPress: () => console.log("no Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => { cancelRideInDatabase() } },
      ]
    );
  }
  
  //starts the ride
  const startRide = async () => {
    const rideDocRef = doc(firestore, 'ride', `${ride.key}`);

    try {
      await updateDoc(rideDocRef, {
        'status': 'ongoing',
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      coverScreen={true}
      animationIn={'slideInUp'}
      animationOut={'slideInDown'}
      animationType={'slide'}
      style={[styles.modal, {
        marginVertical: ride.numOfRiders === 4 ? '15%' : ride.numOfRiders === 3 ? '22%' : ride.numOfRiders === 2 ? '32%' : '40%',
      }]}
      onSwipeComplete={() => setShowModal(false)}
      swipeDirection="down"
    >
      <View style={styles.container}>
        {/* <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="arrow-back" size={28} color="red" />
          </TouchableOpacity>
        </View> */}

        <View style={styles.headerContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.headerText} numberOfLines={5}>
              {ride.pickupLocation.substring(0, ride.pickupLocation.indexOf(","))}
              <Text> </Text>
              <MaterialCommunityIcons name="car-hatchback" size={18} color="red" />
              <Text> </Text>
              {ride.dropoffLocation.substring(0, ride.dropoffLocation.indexOf(","))}
            </Text>
          </View>

          <View style={styles.pillsContainer}>
            <View style={styles.pill}>
              <Ionicons name="calendar" size={16} color="black" style={{ marginRight: 5 }} />
              <Text style={styles.pillText}>
                {`${month} ${day}, ${year}`}
              </Text>
            </View>

            <View style={styles.pill}>
              <MaterialCommunityIcons name="clock" size={16} color="black" style={{ marginRight: 5 }} />
              <Text style={styles.pillText}>
                {`${hours}:${min < 10 ? 0 : ''}${min}`}
              </Text>
            </View>

            <View style={styles.pill}>
              <MaterialIcons name="attach-money" size={16} color="black" />
              <Text style={styles.pillText}>
                40.00
              </Text>
            </View>
          </View>
        </View>

        {/* , { height: riders.length === 4 ? '130%' : riders.length === 3 ? '100%' : riders.length === 2 ? '70%' : '50%', marginBottom: riders.length === 4 ? '4%' : 0 } */}
        <View style={[styles.subContainer, { height: riders.length === 4 ? '138%' : riders.length === 3 ? '126%' : riders.length === 2 ? '110%' : '80%', marginBottom: riders.length === 4 ? '2%' : 0 }]}>
          <Text style={styles.subheaderText}>Riders</Text>
          <View style={{}}>
            <FlatList
              data={riders}
              keyExtractor={(item) => {
                return item.key;
              }}
              renderItem={({ item }) => {
                return <DriverInfoCard user={item} ride={ride}/>
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.subheaderText}>Route</Text>
          <DriverRideDetailsMap ride={ride} />
        </View>


        <View style={[styles.subContainer, {marginTop: '24%'}]}>
          <Text style={styles.subheaderText}>Help</Text>
          <TouchableOpacity 
            style={styles.button} 
          >
            <Text style={styles.buttonText}>Contact Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={startRide}
          >
            <Text style={styles.buttonText}>Start Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={cancelRide}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => setShowModal(false)}
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
    </Modal>
  )
}

export default DriverRideDetails

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: '8%',
    maxHeight: '28%'
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: '8%',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomLeftRadius: 21,
    borderBottomRightRadius: 21,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    maxWidth: '90%'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700
  },
  headerContainer: {
    marginBottom: 8,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingHorizontal: '3%',
    paddingVertical: '1%',
    borderRadius: 30,
    marginRight: 6,
    alignItems: 'center'
  },
  pillsContainer: {
    flexDirection: 'row',
  },
  pillText: {
    fontSize: 12
  },
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
    borderRadius: 20
  },
  buttonText: {
    fontWeight: 500
  },
  subContainer: {
    marginBottom: '2%'
  },
  subheaderText: {
    marginBottom: '1%',
    fontSize: 18,
    fontWeight: 500
  },
  exitButton: {
    top: '-25%',
    right: '-40%',
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  }
})