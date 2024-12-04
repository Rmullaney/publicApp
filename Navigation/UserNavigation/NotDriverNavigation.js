import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';

import { auth, firestore } from '../../API/firbaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import NotDriverScreen from '../../screens/NotDriverScreens/NotDriverHome/NotDriverScreen';
import DriverSignUp from '../../screens/NotDriverScreens/NotDriverSignUp/DriverSignUp';
import WaitVerify from '../../screens/NotDriverScreens/NotDriverWaitVerify/NotDriverWaitVerify';
import TermsOfService from '../../components/TermsOfService';

const Stack = createStackNavigator();

export default function NotDriverNavigation() {
    const [data, setData] = useState(true);

    useEffect(() => {
        
        const userRef = doc(firestore, 'users', auth.currentUser.uid);

        const fetchData = async () => {
          try {
            // Perform asynchronous operations
            const user = await getDoc(userRef);
            if (user.exists()){
              setData(user.data().driver.awaitingVerification);
            } else {
              setData(false);
            }
            
          } catch (error) {
            console.error(error);
          }
        };

        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()){
              setData(docSnapshot.data().driver.awaitingVerification);
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
            {data ? 
            <InnerAwaitingStack/>
            :
            <InnerNDNStack/>
            }
        </>
    );
}

function InnerAwaitingStack() {
    return (
        <Stack.Navigator
          screenOptions={{
            headerShown:false
          }}  
        >
            <Stack.Screen name="WaitVerify" component={WaitVerify}/>
        </Stack.Navigator>
    );
}


function InnerNDNStack() {
    return (
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
            <Stack.Screen name="NotDriverHome" component={NotDriverScreen}/>
            <Stack.Screen name="DriverSignUp" component={DriverSignUp}/>
            <Stack.Screen name="TermsOfService" component={TermsOfService} options={{ presentation: 'modal' }}/>
        </Stack.Navigator>
    );
}

