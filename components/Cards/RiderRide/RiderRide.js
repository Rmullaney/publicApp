import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet, Modal, Button, Icon } from "react-native";
import { TimestampDate } from "timestamp-date";
import moment from "moment/moment";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ContactAdmin from "../../../screens/Settings/SettingsContactAdmin/SettingsContactAdmin";

const apiKey = "";

const ts = new TimestampDate();



const RiderRide = ({ ride, navigation }) => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const RiderRideModal = (props) => {
    return (
      <View >
        <Pressable onPress={() => toggleModal()}>
          <Icon name="arrow-down" size={30} color='red' type='entypo'/>
        </Pressable>
        <ModalContent ride={props.ride} navigation={navigation}/>
      </View> 
    );
  }
  
  return (
    <View>
      <Pressable onPress={() => toggleModal()} >
        <RiderRideContent ride={ride} />
      </Pressable >

      <Modal
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => toggleModal()}
        presentationStyle="pageSheet"
      >
        
        <RiderRideModal ride={ride}/>
        
      </Modal>
    </View>
    
  );
};


const RiderRideContent = ({ ride }) => {
  return (
    <View style={styles.box}>
      <Text>
        {ride.pickupLocation}
        <Icon name="arrow-right" size={20} color="black" type="entypo" />
        {ride.dropoffLocation}
      </Text>
      <Text>
        <Icon name="users" size={20} color="black" type="entypo" />{" "}
        {ride.numOfRiders}
      </Text>
      <Text>
        <Icon name="calendar" size={20} color="black" type="entypo" />{" "}
        {moment(ts.timestampToDate(ride.pickupDate)).format("MMM Do YYYY")}
      </Text>
      <Text>
        <Icon name="time-slot" size={20} color="black" type="entypo" />{" "}
        {moment(ts.timestampToDate(ride.pickupDate)).format("hh:MMa")}
      </Text>
    </View>
  );
};

const ModalContent = (props) => {

  return(
    <View>
      {//pickup and destination
      }
      <View style={{alignItems: 'flex-start', padding: 15}}>
        <Text style={{fontWeight: 'bold', fontSize: 30}}>
          {props.ride.pickupLocation} {<MaterialIcons name="arrow-forward-ios" size={20} color="red" />}
          {'\n'}{props.ride.dropoffLocation}
        </Text>
      </View>

      {//date, time, cost
      }
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <View></View>
        <View style={styles.dateTimeBubbles}>
          <MaterialIcons name="calendar-today" size={20} color="black" />
          <Text>{moment(ts.timestampToDate(props.ride.pickupDate)).format("MMM Do YYYY")}</Text>
        </View>

        <View style={styles.dateTimeBubbles}>
          <MaterialIcons name="watch-later" size={20} color="black" />
          <Text>{moment(ts.timestampToDate(props.ride.pickupDate)).format("hh:MMa")}</Text>
        </View>

        <View style={styles.dateTimeBubbles}>
          <Text>$200</Text>
        </View>
        <View></View>
      </View>

      {//driver info
      }
      <View style={{alignItems: 'flex-start', padding: 15, marginBottom: 0}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Driver</Text>

        <UserIcon firstName={props.ride.driver.firstName} lastName={props.ride.driver.lastName}/>
      </View>

      {//rider info
      }
      <View style={{alignItems: 'flex-start', padding: 15}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Riders</Text>

        <View>
          {Object.entries(props.ride.riders).map(([key, value]) => {
            return <UserIcon firstName={value.firstName} lastName={value.lastName}/>;
          })}
        </View>
      </View>


      <View style={{alignItems: 'flex-start', padding: 15}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Route</Text>
      </View>

      {/*
      
      <View style={{alignItems: 'flex-start', padding: 15}}>
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={{
            latitude: ride.ride.pickupCoordinates.lat,
            longitude: ride.ride.pickupCoordinates.lng,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009
          }}
          mapType='mutedStandard'
        >
          {ride.ride.pickupCoordinates.lat && (
            <Marker 
              coordinate={{
                latitude: ride.ride.pickupCoordinates.lat,
                longitude: ride.ride.pickupCoordinates.lng
              }}
              title='Pickup'
              description={ride.ride.pickupLocation}
              identifier='pickupLocation'
            />
          )}

          {ride.ride.dropoffCoordinates.lat && (
            <Marker 
              coordinate={{
                latitude: ride.ride.dropoffCoordinates.lat,
                longitude: ride.ride.dropoffCoordinates.lng
              }}
              title='Dropoff'
              description={ride.ride.dropoffLocation}
              identifier='dropoffLocation'
            />
          )}

          {ride.ride.pickupCoordinates.lat && ride.ride.dropoffCoordinates.lat && (
            <MapViewDirections
              origin={ride.ride.pickupLocation}
              destination={ride.ride.dropoffLocation}
              apikey={apiKey}
              strokeWidth={3}
              strokeColor='black'
            />
          )}
        </MapView>
      </View>

      */}

      {//help
      }
      <View style={{alignItems: 'flex-start', padding: 15}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Help</Text>

        <View style={{alignItems: 'center'}}>
          <Button title="Contact Admin" onPress={() => {}}/>
          <Button title="Cancel Ride" onPress={() => {}}/>
        </View>
      </View>
    </View>
  );
}

//for each displayed person in rider and driver sections
const UserIcon = (props) => {

  return (
    <View style={{flexDirection: 'row', padding: 4}}>
      <View style={{backgroundColor: 'grey', borderRadius: 2}}>
        <MaterialIcons name="person" size={30} color="black"/>
      </View>

      <View style={{width: 300}}>
        <Text style={{fontSize: 20, marginLeft: 20}}>{props.firstName} {props.lastName[0]}.</Text>
        
        {//<Text style={{fontSize: 20, marginLeft: 20}}>Temporar Y.</Text>
        }
      </View>
    
      <Pressable onPress={() => {}}>
        <MaterialIcons name="chat-bubble-outline" size={20} color="red"/>
      </Pressable>
    </View>
  );
}




export default RiderRide;



const styles = StyleSheet.create({
  box: {
    width: 300,
    height: 125,
    backgroundColor: "grey",
    alignItems: "center",
    padding: 6,
    margin: 8,
  },
  dateTimeBubbles: {
    backgroundColor: '#d3d3d3', 
    flexDirection: 'row', 
    borderRadius: 25, 
    margin: 6, 
    padding: 8
  }
});
