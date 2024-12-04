import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import BottomSheet, { BottomSheetScrollView, BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../../../API/firbaseConfig';
import RideCard from './RideCards/RideCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';

// Props: navigation, toggleLocationModal, ride, setRide
const ChooseARideBottomSheet = (props) => {
  // ref
  // const props.homeBottomSheet = useRef(null);
  // state
  const [count, setCount] = useState(0);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT', '23%'], []);

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
      { paddingBottom: safeBottomArea + 50 || 6 },
    ],
    [safeBottomArea]
  );

  // variables
  // const snapPoints = useMemo(() => ['15%', '27%', '92%'], []);

  /* Fetch rides on the same day going to the same location */
  const [similarRides, setSimilarRides] = useState([]);

  // Return true if ride's pickup date is is on the same day as the target date, false otherwise
  const isSameDate = (compareRide, targetRide) => {
    if (!compareRide.pickupDate) return false;

    // Compare ride date 
    const date = new Date(Date.parse(compareRide.pickupDate))

    // Target Date
    const targetDate = new Date(Date.parse(targetRide.pickupDate))

    return (
      date.getUTCDate() === targetDate.getUTCDate()
      && date.getUTCMonth() === targetDate.getUTCMonth()
      && date.getUTCFullYear() === targetDate.getUTCFullYear()
    )
  }

  // Sets similarRides to all upcoming rides with < 4 passengers whose dropoff location and pickup day are the same
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the numOfRider < 4 and oders it by price
    const q = query(
      rideRef,
      where("status", "==", "upcoming"),
      where('numOfRiders', 'in', [1, 2, 3]),
      where('dropoffCoordinates', '==', props.ride.dropoffCoordinates),
      // orderBy('money.pricerPerRider', 'asc')
    );

    // Allows realtime updates when ride collection is updated
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = [];
      querySnapshot.forEach((doc) => {
        if ((!Object.getOwnPropertyNames(doc.data().riders).includes(`${auth.currentUser.uid}`) && isSameDate(doc.data(), props.ride))) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
      });
      setSimilarRides(rides);
  console.log(props.ride.dropoffCoordinates);

    });

    return () => unsubscribe();
  }, []);

  // selected list item
  const [selectedRide, setSelectedRide] = useState(undefined);

  const { showActionSheetWithOptions } = useActionSheet();

  const onEditRidePress = () => {
    const options = ['Edit pickup/dropoff location', 'Edit pickup time', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      cancelButtonTintColor: 'red'
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 1:
          // console.log('edit time')
          // props.toggleDatePickerModal();
          props.toggleChooseARideBottomSheet()
          props.toggleEditDateModal()
          break;

        case 0:
          // console.log('edit location')
          props.toggleEditLocationModal()
          // props.navigation.navigate('MakeARideAlt')
          break;

        case cancelButtonIndex:
        // Canceled
      }
    })
  }

  return (
    <BottomSheet
      ref={props.chooseARideBottomSheet}
      index={0}
      // snapPoints={snapPoints}
      // onChange={handleSheetChanges}
      // style={{
      //   paddingHorizontal: '5%'
      // }}
      backgroundStyle={{
        borderRadius: 30
      }}
      handleIndicatorStyle={{
        backgroundColor: '#d9d9d9'
      }}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={false}
      animateOnMount={true}
    >

      <BottomSheetView
        style={contentContainerStyle}
        onLayout={handleContentLayout}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Choose your ride</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              props.toggleChooseARideBottomSheet()
              props.toggleAddLuggageModal()
            }}
          >
            <Text style={styles.buttonText}>Add Luggage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => onEditRidePress()}
          >
            <Text style={styles.buttonText}>Edit Ride</Text>
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView>

          <Pressable
            onPress={() => {
              setSelectedRide(props.ride.key)
            }}
          >
            <RideCard
              ride={props.ride}
              active={selectedRide === props.ride.key}
              discount={false}
            />
          </Pressable>

          {similarRides.length > 0 && (
            <View style={styles.subheader}>
              <Text style={styles.subheaderText}>Or, share a ride and save money!</Text>
            </View>
          )}

          {similarRides.map((item) => (
            <Pressable
              onPress={() => {
                setSelectedRide(item.key)
              }}
            >
              <RideCard
                ride={item}
                active={selectedRide === item.key}
                discount={true}
              />
            </Pressable>
          ))}

        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  )

}

export default ChooseARideBottomSheet

const styles = StyleSheet.create({
  headerText: {
    fontSize: 34,
    fontWeight: 700,
  },
  headerContainer: {
    marginBottom: '2%',
    paddingHorizontal: '4%'
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: '4%',
    marginBottom: '4%',
  },
  button: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 24,
    marginRight: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 700,
    color: 'white',
    fontSize: 16
  },
  handleContainer: {
    marginBottom: '3%'
  },
  backButton: {
    position: 'absolute',
    top: '8%',
    left: '4%',
    height: 44,
    width: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createRideContainer: {
    padding: '4%',
    backgroundColor: '#fff',
    top: '23%'
  },
  createRideButton: {
    paddingVertical: '3%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  createRideButtonText: {
    fontWeight: 700,
    color: '#fff',
    fontSize: 20
  },
  subheaderContainer: {
    backgroundColor: '#fff'
  },
  subheader: {
    // paddingVertical: '3%',
    paddingLeft: '3%',
    paddingVertical: '3%'
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: 500,
  }
})