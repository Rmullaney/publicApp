import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, firestore } from '../../../../API/firbaseConfig';
import { updateDoc, doc , deleteField } from 'firebase/firestore'

const RideDetailsModalAlt = (props) => {

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainerStyle,
      { paddingBottom: props.ride?.driver?.firstName ? safeBottomArea : safeBottomArea - 10 || 6 },
    ],
    [safeBottomArea]
  );

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  props.showDetailsModal && handlePresentModalPress();

  const handleSheetChanges = useCallback((index) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  }

  // Get date info
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }


  // let date;
  // if (ride.pickupDate.seconds !== undefined){
  //   const seconds = ride.pickupDate.seconds;
  //   date = new Date(seconds * 1000);
  // } else {
  //   date = new Date(ride.pickupDate);
  // }

  const dateObject = new Date(props.ride?.pickupDate);
  // const date = new Date(seconds * 1000)


  const hours = dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()
  const min = dateObject.getMinutes()
  const day = dateObject.getDate()
  const month = monthString(dateObject.getMonth());
  const year = dateObject.getFullYear()
  const amOrPm = dateObject.getHours() >= 12 ? 'pm' : 'am'

  const pickupRideEndIndex = props.ride?.pickupLocation.indexOf(",") > 0 ? props.ride?.pickupLocation.indexOf(",") : props.ride?.pickupLocation.length;
  const dropoffRideEndIndex = props.ride?.dropoffLocation.indexOf(",") > 0 ? props.ride?.dropoffLocation.indexOf(",") : props.ride?.dropoffLocation.length

  const numBags = props.ride?.luggage.largeLuggageCount + props.ride?.luggage.mediumLuggageCount + props.ride?.luggage.smallLuggageCount;

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
    const rideDocRef = doc(firestore, 'ride', `${props.ride.key}`);

    try {
      if (props.ride.numOfRiders === 1) { // If only rider, cancel ride
        // To update age and favorite color:
        await updateDoc(rideDocRef, {
          'status': 'canceled'
        });
      } else { // If one of many riders, remove rider from ride
        const inputData = {}
        const field = `riders.${auth.currentUser.uid}`
        inputData[field] = deleteField();
        await updateDoc(rideDocRef, inputData)
      }
    } finally {
      props.handleExpand(props.homeBottomSheet)
      handleClose()
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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={true}
      animateOnMount={true}
      // onChange={handleSheetChanges}
      handleIndicatorStyle={{
        backgroundColor: '#d9d9d9'
      }}
      onDismiss={() => {
        props.handleExpand(props.homeBottomSheet)
        props.toggleShowDetailsModal()
      }}
    >
      <BottomSheetView
        style={contentContainerStyle}
        onLayout={handleContentLayout}
      >
        <View style={styles.headerContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.dropoffText}><Text style={{ fontWeight: 300 }}>Going to</Text> {props.ride?.dropoffLocation.substring(0, dropoffRideEndIndex)}</Text>
            <Text style={styles.subText}><Text style={{ fontWeight: 400 }}>From </Text><Text style={{ fontWeight: 700 }}>{props.ride?.pickupLocation.substring(0, pickupRideEndIndex)}</Text></Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              props.handleExpand(props.homeBottomSheet)
              handleClose()
              // props.toggleShowDetailsModal()
            }}
          >
            <Ionicons name="close-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.middleContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{month} {day}, {hours}:{min < 10 && 0}{min} {amOrPm}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>${props.ride?.money?.pricePerRider}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="ios-people-sharp" size={20} color="black" />
            <Text style={styles.infoText}> {props.ride?.numOfRiders} rider</Text>
          </View>

          <View style={styles.infoContainer}>
            <MaterialCommunityIcons name="bag-suitcase" size={20} color="black" />
            <Text style={styles.infoText}> {numBags} bags</Text>
          </View>
        </View>

        {props.ride?.driver?.firstName && (
          <View style={styles.driverContainer}>
            <View style={styles.driverLeft}>
              <View style={styles.pictureContainer}>
                <Text>Picture</Text>
              </View>

              <View>
                <Text style={styles.subText}>{props.ride?.driver?.firstName} {props.ride?.driver?.lastName.charAt(0)}.</Text>
                <Text style={styles.subText}>{props.ride?.driver?.phoneNumber}</Text>
              </View>
            </View>

            <View style={styles.driverRight}>
              <Text style={styles.subText}>{props.ride?.driver?.car.licensePlate}</Text>
              <Text style={styles.subText}>{props.ride?.driver?.car.make} {props.ride?.driver.car.model}</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>Contact Admin</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.button}
            onPress={cancelRide}
          >
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: '5%',
    marginTop: '2%',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '2%'
  },
  locationContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: '3.5%',
    // backgroundColor: 'lightblue',
  },
  dropoffText: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: '1.5%',
  },
  // subText: {
  //   fontSize: 14,
  // },  
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    // backgroundColor: 'pink',
    flex: 1
  },
  priceText: {
    fontSize: 18,
    fontWeight: 500,
    color: 'red',
  },
  middleContainer: {
    flexDirection: 'row',
    marginBottom: '8%'
  },
  editText: {
    color: 'red'
  },
  infoContainer: {
    backgroundColor: '#f2f2f2',
    padding: '2%',
    borderRadius: 3,
    marginRight: '2%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pictureContainer: {
    marginRight: '10%',
  },
  driverContainer: {
    flexDirection: 'row',
    marginBottom: '8%',
  },
  driverLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  driverRight: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    marginBottom: '2%'
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: '1.5%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff'
  },
});


export default RideDetailsModalAlt;