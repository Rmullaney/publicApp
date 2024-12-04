import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TimestampDate } from "timestamp-date";
import moment from "moment/moment";
import { Icon } from "react-native-elements";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ts = new TimestampDate();

const RiderRideContent = ({ ride }) => {

  const getTime = () => {
    const seconds = ride.pickupDate.seconds

    const date = new Date(seconds * 1000)
    const hours = date.getHours()
    const min = date.getMinutes()

    return `${hours > 12 ? hours - 12 : hours}:${min}`
  }

  return (
    <View style={styles.box}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
        <Text 
          style={[styles.bodyText, {flex: 3}]}
          numberOfLines={1}
        >{ride.pickupLocation}</Text>
        <MaterialCommunityIcons name="car-hatchback" size={16} color="red" style={{
          flex: .5
        }}/>
        <Text 
          style={[styles.bodyText, {flex: 3}]}
          numberOfLines={1}
        >{ride.dropoffLocation}</Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={styles.pill}>
          <Ionicons name="calendar" size={16} color="black" style={{marginRight: 5}}/>
          <Text>
            {moment(ts.timestampToDate(ride.pickupDate)).format("MMM Do YYYY")}
          </Text>
        </View>

        <View style={styles.pill}>
          <MaterialCommunityIcons name="clock" size={16} color="black" style={{marginRight: 5}}/>
          <Text>
            {getTime()}
          </Text>
        </View>

        <View style={styles.pill}>
          <Ionicons name="car" size={16} color="black" style={{marginRight: 5}}/>
          <Text>
            {ride.driver.firstName} {ride.driver.lastName.charAt(0)}.
          </Text>
        </View>

        <View style={styles.pill}>
          <Ionicons name="people" size={16} color="black" style={{marginRight: 5}}/>
          <Text>
            {ride.numOfRiders}
          </Text>
        </View>
      </View>
 
    </View>
  );
};

export default RiderRideContent;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    padding: 16,
    paddingBottom: 10,
    margin: 20,
    marginTop: 6,
    borderRadius: 15
  },
  bodyText: {
    fontSize: 16,
    fontWeight: 500,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 30,
    marginHorizontal: 3
  }
});
