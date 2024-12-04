import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const RiderUpcomingRideContent = ({ ride }) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  const seconds = ride.pickupDate.seconds
  const date = new Date(seconds * 1000)
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthString(date.getMonth());
  const year = date.getFullYear()

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  return (
    <View style={styles.box}>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text
          style={styles.headerText}
          numberOfLines={2}
        >
          {ride.pickupLocation}
          <Text> </Text>
          <MaterialCommunityIcons name="car-hatchback" size={18} color="red" />
          <Text> </Text>
          {ride.dropoffLocation}
          {/* {.substring(0, ride.dropoffLocation.indexOf(","))} */}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={styles.pill}>
          <Ionicons name="calendar" size={13} color="black" style={{marginRight: 5}}/>
          <Text style={styles.pillText}>
            {`${month} ${day}, ${year}`}
          </Text>
        </View>

        <View style={styles.pill}>
          <MaterialCommunityIcons name="clock" size={13} color="black" style={{marginRight: 5}}/>
          <Text style={styles.pillText}>
            {`${hours}:${min < 10 ? 0 : ''}${min}${amOrPm}`}
          </Text>
        </View>

        <View style={styles.pill}>
          <Ionicons name="people" size={13} color="black" style={{marginRight: 5}}/>
          <Text style={styles.pillText}>
            {ride.driver.firstName} {ride.driver.lastName?.charAt(0)}.
          </Text>
        </View>

        <View style={styles.pill}>
          <Ionicons name="people" size={13} color="black" style={{marginRight: 5}}/>
          <Text style={styles.pillText}>
            {ride.numOfRiders}
          </Text>
        </View>
      </View>
 
    </View>
  )
}

export default RiderUpcomingRideContent

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#f2f2f2",
    alignItems: 'flex-start',
    padding: 10,
    paddingBottom: 10,
    marginHorizontal: 20,
    marginTop: 8,
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
    marginRight: 6
  },
  pillText: {
    fontSize: 12
  },
  headerText: {
    fontSize: 16,
    fontWeight: 500
  }
});
