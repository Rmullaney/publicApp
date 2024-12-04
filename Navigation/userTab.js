import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { auth, firestore } from "../API/firbaseConfig.js";
import { doc, collection, query, where, onSnapshot, updateDoc, increment, getDoc} from "firebase/firestore";

import DriverStack from './UserNavigation/DriverNavigation/DriverHomeStack';
import RiderHomeStack from './UserNavigation/RiderNavigation/RiderHomeStack';

import { Ionicons } from '@expo/vector-icons';
import SettingsDrawer from './UserNavigation/SettingsNavigation/SettingsDrawer.js';
import DriverInRideDrawer from './UserNavigation/DriverNavigation/DriverInRideDrawer.js';
import RiderInRideDrawer from './UserNavigation/RiderNavigation/RiderInRideDrawer.js';
// import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler.js';

const Tab = createBottomTabNavigator();

export default function UserTab() {
  
  const [currDriver, setCurrDriver] = useState(false);
  const [currRider, setCurrRider] = useState(false);


  //initial params and route.params.*** not working. 
  //will probably have to add a field to user at this point 'currRide' that holds a reference to a ride doc


 
  const addToUserDoc = async (ride) => {
    const userRef = doc(firestore, "users", auth.currentUser.uid);
    await updateDoc(userRef, {'currRide' : ride})
  } 

  /**
   * if all riders plus driver are done w ride, change status to 'past'
   * @param {*} doc document to test if need to update status
   * @returns no returns
   */
  const checkSwapToPastRide = async (docu) => {
    const data = docu.data();
    var riders = true;
    const riderMap = data.riders;
    for (let subMap of Object.values(riderMap)) {
      //for outdated shit
      if (subMap.riderDone === undefined) {
        return;
      }
      //actual test
      if (subMap.riderDone === false){
        riders = false;
      }
    }
    if (data.driverDone && riders) {
      try {
        const docRef = doc(firestore, 'ride', docu.id);
        await updateDoc(docRef, {'status': 'past'});
        updateRiderStats(data.money.pricePerRider);
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  }

  /**
   * updates the user doc with the ride stats
   * @param {int} amount amount of money that the ride costs
   */
  const updateRiderStats = async (amount) => {
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const rides = userSnap.data().totalRides+1;
    const money = userSnap.data().moneySpent+amount;
    await updateDoc(userRef, {'moneySpent':money, 'totalRides':rides});
  }
  

  //check to flip onto the inRide stack
  useEffect(() => {

    //collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all rides
    const q = query(
      rideRef,
      where("status", "==", "ongoing")
    );

    //does the work to see if nav needs to be changed
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const userid = `${auth.currentUser.uid}`;

      querySnapshot.forEach((doc) => {

        //check for false->true change
        if (!(currDriver || currRider)){
          if (Object.getOwnPropertyNames(doc.data().riders).includes(userid) && doc.data().riders[userid].riderDone === false){
            setCurrRider(true);
            addToUserDoc(doc.id); 
          } else if (doc.data().driver.driverId === userid && doc.data().driverDone === false){
            setCurrDriver(true);
            addToUserDoc(doc.id);
          }
        //check for true->false change
        } else {
          if (Object.getOwnPropertyNames(doc.data().riders).includes(userid) && doc.data().riders[userid].riderDone === true){
            setCurrRider(false);
            checkSwapToPastRide(doc);
          } else if (doc.data().driver.driverId === userid && doc.data().driverDone === true){
            setCurrDriver(false);
            checkSwapToPastRide(doc);
          }
        }
      });
    });
  

    return () => unsubscribe();
  }, []); 
  
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route, navigation}) => ({
          tabBarIcon: ({color, focused, size}) => {
            let iconName;
            if (route.name === 'RiderHomeStack') {
              iconName = focused ? 'person' : 'person-outline'
            } else if (route.name === 'DriverStack') {
              iconName = focused ? 'car' : 'car-outline'
            } else if (route.name === 'SettingsDrawer') {
              iconName = focused ? 'ios-settings' : 'ios-settings-outline'
            }
  
            return <Ionicons name={iconName} size={18} color={color}/>
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: {height: 70, paddingTop: 5},
          headerShown: false
        })}
      >
        {currRider ? <Tab.Screen name="RiderInRideDrawer" component={RiderInRideDrawer} options={{headerShown: false}} /> : <Tab.Screen name="RiderHomeStack" component={RiderHomeStack} options={{tabBarLabel: 'Rider'}} />}
        {currDriver ? <Tab.Screen name="DriverInRideDrawer" component={DriverInRideDrawer} options={{headerShown: false}} /> : <Tab.Screen name="DriverStack" component={DriverStack} options={{tabBarLabel: 'Driver'}} /> }
        <Tab.Screen name="SettingsDrawer" component={SettingsDrawer} options={{tabBarLabel: 'Profile'}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}


