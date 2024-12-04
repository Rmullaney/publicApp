import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {collection, query, where, onSnapshot, updateDoc, increment, doc, getDoc} from "firebase/firestore";
import RiderRide from "../../../components/Cards/RiderRide/RiderRide";
import { auth, firestore } from "../../../API/firbaseConfig";
import PastRide from "../../../components/Cards/PastRide/PastRide";

const myListEmpty = () => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text justifyContent="center" alignItems="center">
        No rides yet
      </Text>
    </View>
  );
};

const SettingsPastRides = () => {
  const [pastRides, setPastRides] = useState([]);

  useEffect(() => {
    const rideRef = collection(firestore, "ride");
    const q = query(rideRef, where("status", "==", "past"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides = [];
      const userid = `${auth.currentUser.uid}`;

      querySnapshot.forEach((doc) => {
        if (Object.getOwnPropertyNames(doc.data().riders).includes(userid)) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
        setPastRides(rides);
      });
    });

    return () => unsubscribe();
  }, []);
  return (
    <View>
      <FlatList
        data={pastRides}
        ListEmptyComponent={myListEmpty}
        keyExtractor={(item) => {
          return item.key;
        }}
        renderItem={({ item }) => {
          return <PastRide ride={item}/>;
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const RenderList = (doneRides) => {
  let content;
  if (doneRides.doneRides.length !== 0) {
    //console.log(doneRides.doneRides);
    content = (
      <FlatList
        data={doneRides}
        ListEmptyComponent={myListEmpty}
        keyExtractor={(item) => {
          return item.key;
        }}
        renderItem={({ item }) => {
          //return <RiderRide ride={item} />;
          return <Text>{item.key}</Text>;
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  } else {
    console.log("empty");
  }
  return content;
};
export default SettingsPastRides;
