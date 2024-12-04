import { createStackNavigator } from "@react-navigation/stack";

import React, { useEffect, useState } from 'react';

import DriverTopTabGroup from "./DriverTopTabGroup";
import NotDriverNavigation from "../../../Navigation/UserNavigation/NotDriverNavigation";

import { auth, firestore } from "../../../API/firbaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import DriverRideDetails from "../../../screens/DriverScreens/DriverRideDetails/DriverRideDetails";
import DriverMarketplace from "../../../screens/DriverScreens/DriverMarketplace/DriverMarketplace";
import { View } from "react-native";
import DriverSignUp from "../../../screens/NotDriverScreens/NotDriverSignUp/DriverSignUp";

const Stack = createStackNavigator();

export default function DriverStack() {
  
  const [data, setData] = useState(false);

  useEffect(() => {

    const userRef = doc(firestore, 'users', auth.currentUser.uid);

    const fetchData = async () => {
      try {
        // Perform asynchronous operations
        const user = await getDoc(userRef);
        if (user.exists()){
          setData(user.data().driver.isDriver);
        } else {
          setData(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()){
        setData(docSnapshot.data().driver.isDriver);
      } else {
        setData(false);
      }
    })

    fetchData();

    // Call the async function
    return () => unsubscribe();
  }, []); 


	return (
		<>
			{data ? <InnerStack /> : <NotDriverNavigation />}
      {/* <InnerStack /> */}
		</>
	);
}

function InnerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="DriverTopTabGroup" component={DriverTopTabGroup} />
      <Stack.Screen name="MyRides" component={DriverRideDetails} />
      <Stack.Screen name="DriverMarketplace" component={DriverMarketplace} />
      <Stack.Screen name="DriverRideDetails" component={DriverRideDetails} />
      <Stack.Screen name="DriverSignUp" component={DriverSignUp}/>
    </Stack.Navigator>
  );
}


    