import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, firestore } from "../../../API/firbaseConfig";
import DriverUpcomingRide from '../../../components/Cards/Driver/UpcomingRide/DriverUpcomingRide'
import DriverDetailsBottomSheet from "../DetailsBottomSheet/DriverDetailsBottomSheet";

export default function IsDriverHome() {

  // Upcoming ride data to be used for display
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [upcomingRidesCount, setUpcomingRidesCount] = useState(0);

  // Number of past rides this month
  const [pastRides, setPastRides] = useState([]);
  // Profit from past rides this month
  const [profit, setProfit] = useState(0);

  // Whether modal for ride details is displayed
  const [showModal, setShowModal] = useState(false);
  const [modalRide, setModalRide] = useState({});

  const myListEmpty = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text justifyContent="center" alignItems="center">
          No upcoming rides
        </Text>
      </View>
    );
  };

  // Retrieves upcoming ride data when the page loads
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the user is the driver
    const q = query(rideRef, where("driver.driverId", "==", `${auth.currentUser.uid}`), where('status', '==', 'upcoming'))

    // Allows realtime updates when ride collection is updated 
    // Sets up the upcoming ride data to be used 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides = []
      querySnapshot.forEach((doc) => {
        rides.push({
          ...doc.data(),
          key: doc.id
        })


      });
      setUpcomingRides(rides)

      setUpcomingRidesCount(rides.length)
    })

    return () => unsubscribe();
  }, []);


  // Retrieves all past rides this month
  useEffect(() => {
    // First day of the month
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all past rides this month where the user is the driver
    const q = query(rideRef, where("driver.driverId", "==", `${auth.currentUser.uid}`), where('status', '==', 'past', where('pickupDate', '>=', firstDay)))

    // Allows realtime updates when ride collection is updated 
    // Creates an array of the driver profit from each past ride
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides = []
      querySnapshot.forEach((doc) => {
        rides.push(doc.data().money.driverProfit)

      });
      setProfit(rides.reduce((a, b) => a + b, 0))
      setPastRides(rides.length)
    })

    return () => unsubscribe();
  }, []);

  // ref
  const bottomSheetModalRef = useRef(null);

  const openModal = (ref) => {
    ref?.current?.present();
  }

  const handleSnapPress = useCallback((index, ref) => {
    ref.current?.snapToIndex(index);
  }, []);

  const handleExpand = useCallback((ref) => {
    ref?.current?.expand()
  }, []);

  const handleClose = useCallback((ref) => {
    ref?.current?.close()
  }, []);

  return (
    // <BottomSheetModalProvider>
      <View style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 6 }}>
        {/* {!data && <NotDriverOverlay navigation={navigation}/>} */}


        <ScrollView style={{ flex: 1 }}>
          <Text
            style={styles.headerText}
          >Welcome back, user!</Text>

          <View style={{ flexDirection: 'row' }}>
            <View
              style={styles.largeTile}
            >
              <Text style={{ fontSize: 50, fontWeight: 'bold', paddingTop: 16, color: 'red' }}> {upcomingRidesCount} </Text>
              <Text style={[styles.infoText, { paddingBottom: 16 }]}>upcoming rides</Text>
            </View>

            <View style={{ flex: 3 }}>
              <View style={styles.smallTile}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'red' }}>{pastRides} </Text>
                <Text style={styles.infoText}>rides so far this month</Text>
              </View>
              <View style={styles.smallTile}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'red' }}>${Math.ceil(profit)} </Text>
                <Text style={styles.infoText}>earned this month </Text>
              </View>
            </View>
          </View>

          <View>
            <View>
              <Text style={styles.headerText}>Upcoming Rides</Text>
            </View>
            <View>
              <FlatList
                data={upcomingRides}
                keyExtractor={(item) => {
                  return item.key;
                }}
                renderItem={({ item }) => {
                  return <DriverUpcomingRide
                    ride={item}
                    setShowModal={setShowModal}
                    setModalRide={setModalRide}
                    handleSnapPress={handleSnapPress}
                    openModal={openModal}
                    bottomSheetModalRef={bottomSheetModalRef}
                  />
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={myListEmpty}
              />
            </View>
          </View>

          <DriverDetailsBottomSheet
            bottomSheetModalRef={bottomSheetModalRef}
            handleClose={handleClose}
            handleExpand={handleExpand}
            ride={modalRide}
          />

          {/* {showModal && <DriverRideDetails ride={modalRide} setShowModal={setShowModal} navigation={navigation} />} */}
        </ScrollView>
      </View>
    // </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: 50,
    height: 100,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 400,
    padding: 16,
    paddingBottom: 4
  },
  largeTile: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginLeft: 20,
    marginRight: 8,
    marginTop: 11,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  smallTile: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginRight: 20,
    marginLeft: 5,
    marginTop: 11,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 300
  }
});
