import { View, Text, TouchableOpacity, Platform, SectionList, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { addDataToFirebase } from '../../../API/firestoreMethods';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons } from '@expo/vector-icons';
//import apiKey from '../../../config';

import { auth, firestore } from '../../../API/firbaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import DriverInRideMap from './DriverInRideMap';
import DriverInRideContent from './DriverInRIdeContent';

// const dummyRideId = 'PDbX9pp61f3lXqyNIfbT';

const DriverInRide = ({ navigation }) => {
  const [ride, setRide] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = async () => {
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const rideRefId = userSnap.data().currRide;
      const rideRef = doc(firestore, 'ride', rideRefId);
      const temp = await getDoc(rideRef);
      console.log(temp.data());
      try {
        setRide(temp.data())
      } catch (err) {
        console.log(err.message)
      } finally {
        setIsLoading(!isLoading)
      }
    }

    unsubscribe();
  }, [])

  // const dummyRide = {
  //   dropoffCoordinates: {
  //     lat: 42,
  //     lng: 30
  //   }
  // }

  return (
    <View>
      <View style={{ height: '100%' }}>
        {/* <DriverInRideMap ride={dummyRide} /> */}
        {!isLoading && (
          <View style={{flex: 1}}>
            < DriverInRideMap ride={ride} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: '10%',
                left: '4%',
                height: 44,
                width: 44,
                backgroundColor: '#fff',
                borderRadius: 22,
                opacity: 0.7,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => { navigation.openDrawer() }}
            >
              <Ionicons name="help-circle-outline" size={36} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && <DriverInRideContent ride={ride}/>}

        {/* <InRideContent ride={ride}/> */}

        {isLoading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={'red'} />
            <Text>Loading...</Text>
          </View>
        )}
      </View>
    </View >
  )
}


export default DriverInRide;



