import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ButtonGroup } from "react-native";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth, firestore } from "../../../API/firbaseConfig";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePicker from '@react-native-community/datetimepicker';

const apiKey = "";

const myListEmpty = () => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text justifyContent="center" alignItems="center">
        No rides available
      </Text>
    </View>
  );
};

export default function RiderJoinARide({ navigation, toggleJoinARideModal }) {
  const [availableRides, setAvailableRides] = useState([]);
  const [pickupDateRides, setPickupDateRides] = useState([]);
  const [numOfRidersRides, setNumOfRidersRides] = useState([]);
  const [filterDropoff, setFilterDropoff] = useState({})
  const [filterDate, setFilterDate] = useState(new Date());
  const [activeButton, setActiveButton] = useState('pickupDate');
  const [allRidesIsActive, setAllRidesIsActive] = useState(true);

  const [showJoinARideConfirmation, setShowJoinARideConfirmation] = useState(false);
  const [rideJoined, setRideJoined] = useState(undefined);

  const toggleJoinARideConfirmation = (ride) => {
    setRideJoined(ride);
    setShowJoinARideConfirmation(!showJoinARideConfirmation);
  }

  const toggleAllRidesIsActive = () => {
    setAllRidesIsActive(!allRidesIsActive)
  }

  // Update date time when date changess
  const onDateChange = ({ type }, selectedDate) => {
    if (type == 'set') {
      const currentDate = new Date(selectedDate)
      setFilterDate(currentDate)
    } else {

    }
  }

  // Get rides ordered by pickup date
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the user is the driver
    const q = query(
      rideRef,
      where("status", "==", "upcoming"),
      where('numOfRiders', 'in', [-1, 1, 2, 3]),
      orderBy('pickupDate', 'asc')
    );

    // Allows realtime updates when ride collection is updated
    // Sets up the upcoming ride data to be used
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = [];
      querySnapshot.forEach((doc) => {
        if (!Object.getOwnPropertyNames(doc.data().riders).includes(`${auth.currentUser.uid}`)) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
        setPickupDateRides(rides);

        // First show all rides ordered by pickupDate
        setAvailableRides(rides);

        // Initally show pickupDate ordered rides
        // setAvailableRides(rides)
      });
    });

    return () => unsubscribe();
  }, []);

  // Get rides ordered by number of riders
  useEffect(() => {
    // Collection reference
    const rideRef = collection(firestore, "ride");

    // Fetches all upcoming rides where the user is the driver
    const q = query(
      rideRef,
      where("status", "==", "upcoming"),
      where('numOfRiders', '<', 4),
      orderBy('numOfRiders', 'asc')
    );

    // Allows realtime updates when ride collection is updated
    // Sets up the upcoming ride data to be used
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = [];
      querySnapshot.forEach((doc) => {
        if (!Object.getOwnPropertyNames(doc.data().riders).includes(`${auth.currentUser.uid}`)) {
          rides.push({
            ...doc.data(),
            key: doc.id,
          });
        }
        setNumOfRidersRides(rides);
      });
    });

    return () => unsubscribe();
  }, []);

  // const isSameDate = (ride) => {
  //   if (!ride.pickupDate) return false;

  //   const seconds = ride.pickupDate.seconds
  //   const date = new Date(seconds * 1000)
  //   const day = date.getDate()
  //   const month = date.getMonth()
  //   const year = date.getFullYear()

  //   return (
  //     day === filterDate.getDate()
  //     && month === filterDate.getMonth()
  //     && year === filterDate.getFullYear()
  //   )
  // }

  // Return true if ride's pickup date is is on the same day as the target date, false otherwise
  const isSameDate = (compareRide) => {
    if (!compareRide.pickupDate) return false;

    // Compare ride date 
    const date = new Date(Date.parse(compareRide.pickupDate))

    // Target Date
    const targetDate = filterDate //new Date(Date.parse(filterDate))

    return (
      date.getUTCDate() === targetDate.getUTCDate()
      && date.getUTCMonth() === targetDate.getUTCMonth()
      && date.getUTCFullYear() === targetDate.getUTCFullYear()
    )
  }

  const findRide = () => {
    if (allRidesIsActive) {
      const toSetRides = activeButton === 'pickupDate' ? pickupDateRides : numOfRidersRides;
      setAvailableRides(toSetRides);
      return;
    }

    const ridesToFilter = activeButton === 'pickupDate' ? pickupDateRides : numOfRidersRides;
    const rides = ridesToFilter.filter((ride) => parseFloat(ride?.dropoffCoordinates?.lat).toFixed(2) === parseFloat(filterDropoff.lat).toFixed(2) && parseFloat(ride.dropoffCoordinates.lng).toFixed(2) == parseFloat(filterDropoff.lng).toFixed(2) && isSameDate(ride))
    // && isSameDate(ride)

    setAvailableRides(rides)
  }

  useEffect(() => {
    findRide()
  }, [activeButton, allRidesIsActive])

  /* button group stuff */
  const [selectedIndex, setSelectedIndex] = useState(0);

  const comp1 = () => <Text>Exact date</Text>
  const comp2 = () => <Text>± 1 day</Text>
  const comp3 = () => <Text>± 2 days</Text>
  const comp4 = () => <Text>± 3 days</Text>

  const buttons = [{ element: comp1 }, { element: comp2 }, { element: comp3 }, {element: comp4}];

  return (
    <View style={{alignItems: 'center'}}>
      <GooglePlacesAutocomplete
        placeholder='Destination?'
        onPress={(data, details = null) => {
          setFilterDropoff(details.geometry.location)
          console.log("details", details.geometry.location)
        }}
        query={{
          key: apiKey,
          language: 'en',
        }}
        styles={styles.locationInput}
        enablePoweredByContainer={false}
        fetchDetails={true}
        debounce={300}
        disableScroll
        isRowScrollable={false}
        listUnderlayColor="#d9d9d9"
      />

      <DateTimePicker
        value={filterDate}
        onChange={onDateChange}
        style={{maxWidth: '90%'}}
        display="inline"
        themeVariant="light"
      />

      <ButtonGroup 
        onPress={(selectedIndex) => setSelectedIndex(selectedIndex)}
        buttons={buttons}
        selectedIndex={selectedIndex}
        containerStyle={{height: '10%', borderRadius: 10}}
      />

      <TouchableOpacity style={{backgroundColor: '#f2f2f2'}}>
        <Text>Find Rides</Text>
      </TouchableOpacity>


    </View>
    // <View style={styles.container}>
    //   <View style={styles.headerTextContainer}>
    //     <Text style={styles.headerText}>Share a ride, pay less!</Text>
    //   </View>

    //   <GooglePlacesAutocomplete
    //     placeholder='Where to?'
    //     onPress={(data, details = null) => {
    //       setFilterDropoff(details.geometry.location)
    //       console.log("details", details.geometry.location)
    //     }}
    //     query={{
    //       key: apiKey,
    //       language: 'en',
    //     }}
    //     styles={styles.locationInput}
    //     enablePoweredByContainer={false}
    //     fetchDetails={true}
    //     debounce={300}
    //     disableScroll
    //     isRowScrollable={false}
    //     listUnderlayColor="#d9d9d9"
    //   />

    //   <View style={styles.datePickerContainer}>
    //     <DateTimePicker
    //       value={filterDate}
    //       onChange={onDateChange}
    //       themeVariant="light"
    //     />

    //     <TouchableOpacity
    //       style={styles.searchButton}
    //       onPress={() => {
    //         setAllRidesIsActive(false)
    //         findRide()
    //       }}
    //     >
    //       <Text style={styles.searchButtonText}>Find Rides</Text>
    //     </TouchableOpacity>
    //   </View>

    //   {/* <TouchableOpacity
    //     style={styles.searchButton}
    //     onPress={() => {
    //       setAvailableRides(activeButton === 'pickupDate' ? pickupDateRides : numOfRidersRides)
    //     }}
    //   >
    //     <Text style={styles.searchButtonText}>All rides</Text>
    //   </TouchableOpacity> */}

    //   <View style={styles.scrollViewContainer}>
    //     <ScrollView
    //       style={styles.scrollView}
    //       contentContainerStyle={styles.filtersContainer}
    //       horizontal
    //       showsHorizontalScrollIndicator={false}
    //     >
    //       <Text style={styles.bodyText}>Sort by: </Text>
    //       <TouchableOpacity
    //         style={[styles.filterButton, {
    //           backgroundColor: allRidesIsActive ? 'red' : '#f2f2f2',
    //           color: allRidesIsActive ? 'white' : 'black',
    //         }]}
    //         onPress={() => toggleAllRidesIsActive()}
    //       >
    //         <Text
    //           style={{ color: allRidesIsActive ? 'white' : 'black', fontWeight: 700, fontSize: 13  }}
    //         >
    //           All Rides
    //         </Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={[styles.filterButton, {
    //           backgroundColor: activeButton === 'pickupDate' ? 'red' : '#f2f2f2',
    //           color: activeButton === 'pickupDate' ? 'white' : 'black',
    //         }]}
    //         onPress={() => {
    //           setActiveButton('pickupDate');
    //         }}
    //       >
    //         <Text
    //           style={{ color: activeButton === 'pickupDate' ? 'white' : 'black', fontWeight: 700, fontSize: 13  }}
    //         >
    //           Pickup Time
    //         </Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={[styles.filterButton, {
    //           backgroundColor: activeButton === 'numOfRiders' ? 'red' : '#f2f2f2',
    //           color: activeButton === 'numOfRiders' ? 'white' : 'black',
    //         }]}
    //         onPress={() => {
    //           setActiveButton('numOfRiders');
    //         }}
    //       >
    //         <Text
    //           style={{ color: activeButton === 'numOfRiders' ? 'white' : 'black', fontWeight: 700, fontSize: 13 }}
    //         >
    //           Number of Riders
    //         </Text>
    //       </TouchableOpacity>
    //     </ScrollView>
    //   </View>

    //   <FlatList
    //     data={availableRides}
    //     ListEmptyComponent={myListEmpty}
    //     renderItem={({ item }) => {
    //       return <JoinARideCard ride={item} toggleJoinARideConfirmation={toggleJoinARideConfirmation} />
    //     }}
    //     keyExtractor={(item) => item.key}
    //   />
    //   <StatusBar style="auto" />

    //   {showJoinARideConfirmation && (
    //     <ConfirmJoinARide
    //       ride={rideJoined}
    //       navigation={navigation}
    //       toggleJoinARideModal={toggleJoinARideModal}
    //       toggleJoinARideConfirmation={toggleJoinARideConfirmation}
    //     />
    //   )}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: '6%'
  },
  headerText: {
    fontSize: 20,
  },
  headerTextContainer: {
    marginVertical: '4%',
  },
  locationInput: {
    container: {
      flex: 0,
      position: 'relative',
      width: '100%',
      zIndex: 1,
      marginTop: '12%',
    },
    textInput: {
      fontSize: 16,
      backgroundColor: '#F2F2F2',
    },
    listView: {
      backgroundColor: '#fff',
    }
  },
  datePickerContainer: {
    marginTop: '12%',
    marginLeft: '-3.5%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  searchButton: {
    backgroundColor: 'red',
    paddingVertical: '2%',
    paddingHorizontal: '21%',
    borderRadius: 20,
    marginLeft: '2%',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16
  },
  filtersContainer: {
    alignItems: 'center',
    paddingRight: 10,
  },
  filterButton: {
    padding: '3%',
    borderRadius: 20,
    marginRight: 5,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.10,
    // shadowRadius: 0.75,
  },
  scrollViewContainer: {
    height: '7%'
  }
});
