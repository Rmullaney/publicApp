import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect , useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../../API/firbaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import InRideMap from './RiderInRideMap';
import InRideContent from './RiderInRIdeContent';

const dummyRideId = 'PDbX9pp61f3lXqyNIfbT';

const RiderInRide = ({ navigation }) => {
  const [ride, setRide] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = async () => {
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const temp = userDoc.data().currRide;
      const rideRef = doc(firestore, 'ride', temp);
      const rideDoc = await getDoc(rideRef);

      try {
        setRide(rideDoc.data())
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
        {/* <InRideMap ride={dummyRide} /> */}
        {!isLoading && (
          <View style={{flex: 1}}>
            < InRideMap ride={ride} />
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
              onPress={() => {navigation.openDrawer()}}
            >
              <Ionicons name="help-circle-outline" size={36} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && <InRideContent ride={ride}/>}

        {/* <InRideContent ride={ride}/> */}

        {isLoading && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={'red'}/>
            <Text>Loading...</Text>
          </View>
        )}
      </View> 
    </View >
  )
}


export default RiderInRide;



