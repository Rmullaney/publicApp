import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useEffect, useState, useMemo} from 'react'
import BottomSheet, { BottomSheetScrollView} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../../../API/firbaseConfig';
import RideDetailsModalAlt from './RideDetailsBottomSheet/RideDetailsModalAlt';
import UpcomingRide from './UpcomingRide/UpcomingRide';
import {Dimensions} from 'react-native';
import PendingRide from './PendingRide/PendingRide';
import { getFunctions, httpsCallable } from 'firebase/functions';

const windowWidth = Dimensions.get('window').width;

// Props: navigation, toggleLocationModal, ride, setRide
const RiderHomeAltBottomSheet = (props) => {
  // ref
  // const props.homeBottomSheet = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '24%', '90%'], []);

  // const userRef = doc(firestore, 'users', auth.currentUser.uid);
  
  // ================================================
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnDoe@gmail.com',
    totalRides: 18,
    moneySpent: 75,
  })

  //check to flip onto the inRide stack
  useEffect(() => {

    //user reference
    const userRef = doc(firestore, 'users', auth.currentUser.uid);

    //does the work to see if nav needs to be changed
    const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        totalRides: data.totalRides,
        money: data.moneySpent,
        
      })
    });

    return () => unsubscribe();
  }, []); 

  // ================================================
  
  // // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   // console.log('handleSheetChanges', index);
  // }, []);

  // const handleSnapPress = useCallback((index) => {
  //   props.homeBottomSheet.current?.snapToIndex(index);
  // }, []);

  // const handleExpand = useCallback(() => {
  //   props.homeBottomSheet.current?.expand();
  // }, []);

  // const handleClose = useCallback(() => {
  //   props.homeBottomSheet.current?.close();
  // }, []);

  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [showDetailsModal, setshowDetailsModal] = useState(false)
  const [modalRide, setModalRide] = useState()
  // const [sections, setSections] = useState([]);
  const firstName= user.firstName;
  const lastName = user.lastName;

  const toggleShowDetailsModal = () => {
    setshowDetailsModal(!showDetailsModal)
  }

  const listEmpty = (type) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text justifyContent="center" alignItems="center">
          No rides
        </Text>
      </View>
    );
  };

  // Retrieves upcoming ride data when the page loads
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the user is the driver
    const q = query(
      rideRef,
      //where(`riders.${auth.currentUser.uid}`, "!=", ""),
      where("status", "==", "upcoming")
    );

    // Allows realtime updates when ride collection is updated
    // Sets up the upcoming ride data to be used
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = [];
      const userid = `${auth.currentUser.uid}`;
      querySnapshot.forEach((doc) => {
        if (Object.getOwnPropertyNames(doc.data().riders).includes(userid)) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
      });
      setUpcomingRides(rides);
    });

    () => unsubscribe();
  }, []);

  // Retrieves pending ride data when the page loads
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the user is the driver
    const q = query(
      rideRef,
      //where(`riders.${auth.currentUser.uid}`, "!=", ""),
      where("status", "==", "pendingDriver")
    );

    // Allows realtime updates when ride collection is updated
    // Sets up the upcoming ride data to be used
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = [];
      const userid = `${auth.currentUser.uid}`;
      querySnapshot.forEach((doc) => {
        if (Object.getOwnPropertyNames(doc.data().riders).includes(userid)) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
      });
      setPendingRides(rides);
    });

    () => unsubscribe();
  }, []);

  const createStripe = () => {
    const functions = getFunctions();
    const createStripeCustomerCall = httpsCallable(functions, 'createStripeCustomerCall');
    createStripeCustomerCall({
      email: auth.currentUser.email,
      userId: auth.currentUser.uid,
    })
  }

  return (
    <BottomSheet
      ref={props.homeBottomSheet}
      index={1}
      snapPoints={snapPoints}
      // onChange={handleSheetChanges}
      style={{
        paddingHorizontal: '5%'
      }}
      backgroundStyle={{
        borderRadius: 30
      }}
      handleIndicatorStyle={{
        backgroundColor: '#d9d9d9'
      }}
    >
      <Button onPress={createStripe}>make stripe user</Button>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Hello, {firstName}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.handleSnapPress(1, props.homeBottomSheet)
            props.toggleLocationModal()
          }}
        >
          <Text style={styles.buttonText}>Find a Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            props.handleSnapPress(1, props.homeBottomSheet)
            props.toggleJoinARideModal()
          }}
        >
          <Text style={styles.buttonText}>Join a Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => props.handleSnapPress(2, props.homeBottomSheet)}
        >
          <Text style={styles.buttonText}>My Rides</Text>
        </TouchableOpacity>
      </View>

      {/* <BottomSheetHeader 
        handleSnapPress={props.handleSnapPress}
        toggleLocationModal={props.toggleLocationModal}
        toggleJoinARideBottomSheet={props.toggleJoinARideBottomSheet}
      /> */}

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.createARideContainer}>
          <TouchableOpacity
            style={styles.whereToInput}
            onPressIn={() => {
              // props.navigation.navigate('MakeARideAlt')
              // props.handleClose(props.homeBottomSheet)
              props.toggleLocationModal()
              // props.navigation.navigate('ChooseARide')
            }}
          >
            <MaterialCommunityIcons name="magnify" size={24} color="red" />
            <TextInput
              placeholder="Where to?"
              editable={false}
              placeholderTextColor={'#A19F9F'}
              style={{ fontSize: 18 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>Upcoming Rides</Text>
        </View>

        {upcomingRides.map((item) => (
          <UpcomingRide
            ride={item}
            toggleShowDetailsModal={toggleShowDetailsModal}
            setModalRide={setModalRide}
            handleClose={props.handleClose}
            homeBottomSheet={props.homeBottomSheet}
          />
        ))}

        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>Pending Rides</Text>
        </View>

        {pendingRides.map((item) => (
          <PendingRide
            ride={item}
            toggleShowDetailsModal={toggleShowDetailsModal}
            setModalRide={setModalRide}
            handleClose={props.handleClose}
            homeBottomSheet={props.homeBottomSheet}
          />
        ))}
      </BottomSheetScrollView>

      <RideDetailsModalAlt
        showDetailsModal={showDetailsModal}
        toggleShowDetailsModal={toggleShowDetailsModal}
        handleExpand={props.handleExpand}
        handleClose={props.handleClose}
        homeBottomSheet={props.homeBottomSheet}
        ride={modalRide}
      />
    </BottomSheet>
  )
}

export default RiderHomeAltBottomSheet

const styles = StyleSheet.create({
  headerText: {
    fontSize: 34,
    fontWeight: 700,
  },
  headerContainer: {
    marginBottom: '2%',
    // paddingHorizontal: '6%'
  },
  buttonContainer: {
    flexDirection: 'row',
    // paddingHorizontal: '4%',
    marginBottom: '4%',
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    width: (windowWidth - 70) / 3,
    borderRadius: 24,
    marginRight: '2%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    fontWeight: 700,
    color: 'white',
    fontSize: 16
  },
  createARideContainer: {
    marginBottom: '5%',
    marginHorizontal: '1%'
  },
  subheaderContainer: {
    backgroundColor: '#fff'
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: '6%',
    marginBottom: '3%'
  },
  whereToInput: {
    backgroundColor: '#f2f2f2',
    padding: '3%',
    borderRadius: 20,
    flexDirection: 'row',
  },
  ridesContainer: {
    marginBottom: '10%',
  }
})