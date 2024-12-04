import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import MakeARideAlt from '../MakeARideAlt/MakeARideAlt';
import { useRoute } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import DatePickerModal from './DatePickerModal';
import ChooseARideBottomSheet from './ChooseARideBottomSheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import EditDateModal from './EditRideModals/EditDateModal';
import EditLocationModal from './EditRideModals/EditLocationModal';
import { getDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../../../API/firbaseConfig';
import { addDataToFirebase } from '../../../API/firestoreMethods';
import ConfirmRideCreationOverlay from './confirmRideCreationOverlay';
import AddLuggageModal from './EditRideModals/AddLuggageModal';

const apiKey = "";

const ChooseARide = ({ navigation }) => {
  // Map reference 
  const mapRef = useRef();

  // ChooseARideBottomSheet ref
  const chooseARideBottomSheet = useRef();

  /* Retrieves ride object passed from MakeARide screen */
  // already contains pickup loc and coords and dropoff loc and coords
  const { params } = useRoute();
  const [ride, setRide] = useState(params.ride);

  /* Shows and hides datepicker modal */
  const [showDatePickerModal, setShowDatePickerModal] = useState(true);

  const toggleDatePickerModal = () => {
    setShowDatePickerModal(!showDatePickerModal);
  }

  /* Shows and hides datepicker modal */
  const [showEditDateModal, setShowEditDateModal] = useState(false);

  const toggleEditDateModal = () => {
    setShowEditDateModal(!showEditDateModal);
  }

  /* Shows and hides datepicker modal */
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);

  const toggleEditLocationModal = () => {
    setShowEditLocationModal(!showEditLocationModal);
  }

  /* Shows and hides ChooseARideBottomSheet */
  const [showChooseARideBottomSheet, setShowChooseARideBottomSheet] = useState(false);

  const toggleChooseARideBottomSheet = () => {
    setShowChooseARideBottomSheet(!showChooseARideBottomSheet);
  }

  /* Shows and hides ChooseARideBottomSheet */
  const [showRideCreatedConfirmation, setShowRideCreatedConfirmation] = useState(false);

  const toggleRideCreationConfirmation = () => {
    setShowRideCreatedConfirmation(!showRideCreatedConfirmation);
  }

  /* Shows and hides ChooseARideBottomSheet */
  const [showAddLuggageModal, setShowAddLuggageModal] = useState(false);

  const toggleAddLuggageModal = () => {
    setShowAddLuggageModal(!showAddLuggageModal);
  }

  /* Add distance and inital cost fields to ride */
  // Params:
  // Distance (IN, NUM) - the driving distance between pickup and dropoff 
  const addDistanceToRide = (distance) => {
    ride.distance = distance;
    ride.money.pricePerRider = (distance * 0.82).toFixed(2);
    ride.money.grossProfit = (distance * 0.82).toFixed(2);
    ride.money.driverProfit = (distance * 0.82 * 0.4).toFixed(2);
    ride.money.companyProft = (distance * 0.82 * 100 * 0.6).toFixed(2);
  }

  // Sets markers everytime the user changes a location input
  useEffect(() => {
    const markers = !ride.pickupLocation ? ['dropoffLocation'] : !ride.dropoffLocation ? ['pickupLocation'] : ['pickupLocation', 'dropoffLocation'];
    // Zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(markers, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    })
  }, [ride.pickupLocation, ride.dropoffLocation])

  // Gets relevant current user info
  const getCurrentUserInfo = async () => {
    const userRef = doc(firestore, 'users', `${auth.currentUser.uid}`)
    const user = await getDoc(userRef)

    const userInfo = {
      firstName: user.data().firstName,
      lastName: user.data().lastName,
      // phoneNumber: user.data().phoneNumber,
      riderDone: false,
    }

    return userInfo;
  }

  const requestRide = async () => {
    const riderId = auth.currentUser.uid;
    const riderInfo = await getCurrentUserInfo();
    ride.riders[riderId] = riderInfo;
    ride.createdAt = (new Date())

    console.log(ride)
    await addDataToFirebase('ride', ride).then(() => {
      toggleRideCreationConfirmation();
    });
    
  }

  // selected list item
  // const [selectedRide, setSelectedRide] = useState(ride);

  return (
    <View style={{ flex: 1 }}>

      <MapView
        ref={mapRef}
        style={{ height: '100%' }}
        initialRegion={{
          latitude: 42.8193,
          longitude: -75.5354,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009
        }}
        mapType='mutedStandard'
        // onPress={() => {
        //   Keyboard.dismiss()
        //   handleSnapPress(0);
        // }}
        onMapReady={() => {
          mapRef.current.fitToSuppliedMarkers(['pickupLocation', 'dropoffLocation'], {
            edgePadding: { top: 50, right: 100, bottom: 50, left: 100 },
          })
        }}
      >
        {ride.pickupCoordinates.lat && (
          <Marker
            coordinate={{
              latitude: ride.pickupCoordinates.lat,
              longitude: ride.pickupCoordinates.lng
            }}
            title='Pickup'
            description={ride.pickupLocation}
            identifier='pickupLocation'
          />
        )}

        {ride.dropoffCoordinates.lat && (
          <Marker
            coordinate={{
              latitude: ride.dropoffCoordinates.lat,
              longitude: ride.dropoffCoordinates.lng
            }}
            title='Dropoff'
            description={ride.dropoffLocation}
            identifier='dropoffLocation'
          />
        )}

        {ride.pickupCoordinates.lat && ride.dropoffCoordinates.lat && (
          <MapViewDirections
            origin={ride.pickupLocation}
            destination={ride.dropoffLocation}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor='red'
            onReady={(result) => {
              addDistanceToRide(result.distance)
            }}
          />
        )}
      </MapView>

      {showDatePickerModal &&
        <DatePickerModal
          ride={ride}
          setRide={setRide}
          toggleChooseARideBottomSheet={toggleChooseARideBottomSheet}
          toggleDatePickerModal={toggleDatePickerModal}
          navigation={navigation}
        />
      }

      {showEditDateModal &&
        <EditDateModal
          ride={ride}
          setRide={setRide}
          toggleChooseARideBottomSheet={toggleChooseARideBottomSheet}
          toggleEditDateModal={toggleEditDateModal}
        />
      }

      {showChooseARideBottomSheet && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { navigation.goBack() }}
          >
            <Ionicons name="chevron-back-sharp" size={36} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {showEditLocationModal && (
        <EditLocationModal
          ride={ride}
          setRide={setRide}
          toggleEditLocationModal={toggleEditLocationModal}
        />
      )}

      {showAddLuggageModal && (
        <AddLuggageModal
          ride={ride}
          setRide={setRide}
          toggleAddLuggageModal={toggleAddLuggageModal}
          toggleChooseARideBottomSheet={toggleChooseARideBottomSheet}
        />
      )}

      {showChooseARideBottomSheet && (
        <ChooseARideBottomSheet
          ride={ride}
          setRide={setRide}
          chooseARideBottomSheet={chooseARideBottomSheet}
          toggleChooseARideBottomSheet={toggleChooseARideBottomSheet}
          toggleDatePickerModal={toggleDatePickerModal}
          toggleEditDateModal={toggleEditDateModal}
          toggleEditLocationModal={toggleEditLocationModal}
          toggleAddLuggageModal={toggleAddLuggageModal}
          navigation={navigation}
        />
      )}

      {showChooseARideBottomSheet && (
        <View style={styles.requestRideButtonContainer}>
          <TouchableOpacity
            style={styles.requestRideButton}
            onPress={() => { 
              requestRide()

             }}
          >
            <Text style={styles.requestRideText}>Request Ride</Text>
          </TouchableOpacity>
        </View>
      )}

      {showRideCreatedConfirmation && (
        <ConfirmRideCreationOverlay
          ride={ride}
          naivgation={navigation}
          toggleRideCreationConfirmation={toggleRideCreationConfirmation}
        />
      )}

      {/* {showLocationModal && (
        <MakeARideAlt />
      )} */}

    </View>
  )
}

export default ChooseARide

const styles = StyleSheet.create({
  backButtonContainer: {
    bottom: '90%',
    left: '5%',
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestRideButtonContainer: {
    bottom: '13%',
    paddingVertical: '4%',
    backgroundColor: '#fff',
  },
  requestRideButton: {
    backgroundColor: 'red',
    paddingVertical: '3%',
    marginHorizontal: '6%',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  requestRideText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff'
  }
})
