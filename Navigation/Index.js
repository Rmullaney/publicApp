import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import UserTab from './userTab';
import AuthStack from './authStack';
// import AdminStack from './adminStack';
import { doc, updateDoc, deleteField, getDoc, increment, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../API/firbaseConfig";


export default function RootNavigation() {
  const { user } = useAuthentication();

  return user ? <UserTab /> : <AuthStack />;
}

// function InnerNavigator() {
//     const [bool, setBool] = useState('false');

//     useEffect(() => {

//       const userRef = doc(firestore, 'users', auth.currentUser.uid);

//       const fetchData = async () => {
//         try {
//           const user = await getDoc(userRef);
//           if (user.exists()){
//             setBool(user.data().isAdmin);
//           } else {
//             setBool(false);
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       };

//       const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
//         if (docSnapshot.exists()){
//           setBool(docSnapshot.data().isAdmin);
//         } else {
//           setBool(false);
//         } 
//       });

//       fetchData();
  
//       // Call the async function
//       return () => unsubscribe();
//     }, []); 

//     return (
//       <>
//         {bool ? <AdminStack/> : <UserTab/>}
//       </>
//     )
// }
