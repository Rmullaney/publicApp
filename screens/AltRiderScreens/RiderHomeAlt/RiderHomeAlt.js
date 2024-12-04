import { View, Keyboard, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';
import RiderHomeAltBottomSheet from './RiderHomeAltBottomSheet';
import MakeARideAlt from '../MakeARideAlt/MakeARideAlt';
import MapViewDirections from 'react-native-maps-directions';
import RiderJoinARideModal from './RiderJoinARideModal';

const apiKey = "";

const RiderHomeAlt = ({ navigation }) => {
  /* Bottom Sheet Call Backs */
  // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const homeBottomSheet = useRef();
  const chooseARideBottomSheet = useRef();

  const handleSnapPress = useCallback((index, ref) => {
    ref.current?.snapToIndex(index);
  }, []);

  const handleExpand = useCallback((ref) => {
    ref.current?.expand();
  }, []);

  const handleClose = useCallback((ref) => {
    ref?.current?.close();
  }, []);

  /* Modal toggles */

  const [showLocationModal, setShowLocationModal] = useState(false);

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal)
  }

  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const toggleDatePickerModal = () => {
    setShowDatePickerModal(!showDatePickerModal)
  }

  const [showJoinARideModal, setShowJoinARideModal] = useState(false);

  const toggleJoinARideModal = () => {
    setShowJoinARideModal(!showJoinARideModal)
  }


  // const [showChooseARideBottomSheet, setShowChooseARideBottomSheet] = useState(false);

  // const toggleChooseARideBottomSheet = () => {
  //   setShowChooseARideBottomSheet(!showChooseARideBottomSheet)
  // }

  /* Ride to be created that will be passed between screens and updated */
  /* Rider details, numOfWriters, numOfRiders, status already set at initilzation */
  // LocationModal: pickupLocation, pickupCoordinates, dropoffLocation, dropoffCoordinates
  // DatePickerModal: pickupDate
  // LuggageBottomSheetModal (optional): hasLuggage, smallLuggage, mediumLuggage, largeLuggage
  // Distance, money subfields pricePerRider, driverProfit, companyProfit, grossProfit all calculated when map with new start and end locations is layed out
  const [ride, setRide] = useState({
    riders: {},
    driver: {},
    pickupLocation: '',
    pickupCoordinates: {},
    pickupDate: new Date(),
    dropoffLocation: '',
    dropoffCoordinates: {},
    distance: 0,
    money: {},
    luggage: {
      hasLuggage: false
    },
    createdAt: new Date(),
    numOfWriters: 1,
    numOfRiders: 1,
    status: 'pendingDriver'
  })

  // Sets markers everytime the user changes a location input
  useEffect(() => {
    const markers = !ride.pickupLocation ? ['dropoffLocation'] : !ride.dropoffLocation ? ['pickupLocation'] : ['pickupLocation', 'dropoffLocation'];
    // Zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(markers, {
      edgePadding: { top: 300, right: 50, bottom: 50, left: 50 },
    })
  }, [ride.pickupLocation, ride.dropoffLocation])

  const mapRef = useRef();

  const addDistanceToRide = (distance) => {
    const money = {
      pricePerRider: Math.round(distance * 0.82 * 100) / 100,
      grossProfit: Math.round(distance * 0.82 * 100) / 100,
      driverProfit: (Math.round(distance * 0.82 * 100) / 100) * 0.4,
      companyProft: (Math.round(distance * 0.82 * 100) / 100) * 0.6,
    }

    setRide({
      ...ride,
      distance,
      money
    })
  }

  return (
    // <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 42.8193,
            longitude: -75.5354,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009
          }}
          mapType='mutedStandard'
          onPress={() => Keyboard.dismiss()}
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

        <RiderHomeAltBottomSheet
          navigation={navigation}
          toggleLocationModal={toggleLocationModal}
          setRide={setRide}
          ride={ride}
          handleClose={handleClose}
          handleExpand={handleExpand}
          handleSnapPress={handleSnapPress}
          homeBottomSheet={homeBottomSheet}
          chooseARideBottomSheet={chooseARideBottomSheet}
          toggleJoinARideModal={toggleJoinARideModal}
        />

        {/* {showChooseARideBottomSheet && (
          <ChooseARideBottomSheet
            chooseARideBottomSheet={chooseARideBottomSheet}
            ride={ride}
          />
        )} */}

        {showJoinARideModal && (
          <RiderJoinARideModal 
            navigation={navigation}
            handleSnapPress={handleSnapPress}
            toggleJoinARideModal={toggleJoinARideModal}
            homeBottomSheet={homeBottomSheet}
          />
        )}

        {showLocationModal &&
          <MakeARideAlt
            navigation={navigation}
            toggleLocationModal={toggleLocationModal}
            toggleDatePickerModal={toggleDatePickerModal}
            // setRide={setRide}
            // ride={ride}
            handleSnapPress={handleSnapPress}
            homeBottomSheet={homeBottomSheet}
          />
        }
{/* 
        {showDatePickerModal && (
          <DatePickerModal
            ride={ride}
            setRide={setRide}
            navigation={navigation}
            toggleDatePickerModal={toggleDatePickerModal}
            homeBottomSheet={homeBottomSheet}
            chooseARideBottomSheet={chooseARideBottomSheet}
            handleClose={handleClose}
            handleExpand={handleExpand}
            toggleChooseARideBottomSheet={toggleChooseARideBottomSheet}
          />
        )} */}
      </View>
    // </BottomSheetModalProvider>
  )
}

export default RiderHomeAlt;

const styles = StyleSheet.create({

})
