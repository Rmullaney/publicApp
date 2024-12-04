import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const JoinARideCardContent = (props) => {

  // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const monthString = (monthNum) => {
  //   return monthNames[monthNum]
  // }

  // const seconds = props.ride.pickupDate.seconds
  // const date = new Date(seconds * 1000)
  // const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  // const min = date.getMinutes()
  // const day = date.getDate()
  // const month = monthString(date.getMonth());
  // const year = date.getFullYear()

  // const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  return (
    <View style={props.active ? styles.activeContainer : styles.container}>
      <View style={[styles.leftContainer, {marginLeft: props.active && -4}]}>
        <View style={styles.locationContainer}>
          <Text
            style={styles.locationText}
            numberOfLines={2}
          >
            <Text style={styles.locationText}>{props.ride.pickupLocation.substring(0, props.ride.pickupLocation.indexOf(","))} </Text>
            <MaterialCommunityIcons name="car-hatchback" size={18} color="red" />
            <Text style={styles.locationText}> {props.ride.dropoffLocation.substring(0, props.ride.dropoffLocation.indexOf(","))}</Text>
            {/* {.substring(0, props.ride.dropoffLocation.indexOf(","))} */}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {/* <View style={styles.pill}>
          <Ionicons name="calendar" size={13} color="black" style={{marginRight: 5}}/>
          <Text style={styles.pillText}>
            {`${month} ${day}, ${year}`}
          </Text>
        </View> */}

          {/* <View style={styles.pill}>
            <MaterialCommunityIcons name="clock" size={13} color="black" style={{ marginRight: 5 }} />
            <Text style={styles.pillText}>
              {`${hours}:${min < 10 ? 0 : ''}${min}${amOrPm}`}
            </Text>
          </View> */}

          <View style={styles.pill}>
            <Ionicons name="people" size={13} color="black" style={{ marginRight: 5 }} />
            <Text style={styles.pillText}>
              {props.ride.driver.firstName} {props.ride.driver.lastName?.charAt(0)}.
            </Text>
          </View>

          <View style={styles.pill}>
            <Ionicons name="people" size={13} color="black" style={{ marginRight: 5 }} />
            <Text style={styles.pillText}>
              {props.ride.numOfRiders.riders}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.rightContainer, {marginLeft: props.active && 3}]}>
        <Text style={styles.priceText}>${props.ride.money.pricePerRider}</Text>
      </View>

    </View>
  )
}

export default JoinARideCardContent

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    borderTopColor: '#f2f2f2',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f2f2f2',
    paddingVertical: '2%',
    flexDirection: 'row',
    paddingHorizontal: '5%'
  },
  activeContainer: {
    backgroundColor: '#FFAEAE',
    paddingVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    borderLeftColor: 'red',
    borderLeftWidth: 4,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.28,
    // shadowRadius: 2.00,
    // elevation: 1,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 500
  },
  locationText: {
    fontSize: 18, 
    fontWeight: 600,
  },  
  leftContainer: {
    width: '86%',
  },
  locationContainer: {
    paddingBottom: '2%',
  },
  pill: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 30,
    marginRight: '1.5%'
  },
  pillText: {
    fontSize: 12
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  priceText: {
    fontSize: 18,
    fontWeight: 600
  }
});
