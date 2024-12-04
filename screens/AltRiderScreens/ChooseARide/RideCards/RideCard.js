import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const RideCard = ({ ride, active, discount }) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  const date = new Date(ride.pickupDate)
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const min = date.getMinutes()
  const day = date.getDate()
  const month = monthString(date.getMonth());
  const year = date.getFullYear()

  const amOrPm = date.getHours() >= 12 ? 'pm' : 'am'

  const pickupRideEndIndex = ride.pickupLocation.indexOf(",") > 0 ? ride.pickupLocation.indexOf(",") : ride.pickupLocation.length;
  const dropoffRideEndIndex = ride.dropoffLocation.indexOf(",") > 0 ? ride.dropoffLocation.indexOf(",") : ride.dropoffLocation.length

  return (
    <View style={active ? styles.activeContainer : styles.container}>
      <View style={styles.locationContainer}>
        <Text
          style={styles.dropoffText}
          numberOfLines={2}
        >
          {ride.pickupLocation.substring(0, pickupRideEndIndex)}
          <Text> to </Text>
          {ride.dropoffLocation.substring(0,dropoffRideEndIndex)}
        </Text>

        <View style={styles.pickupLocationContainer}>
          <Text style={styles.subText}>{month} {day}, {hours}:{min < 10 && 0}{min} {amOrPm}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.priceText}>${discount ? (ride.money.pricePerRider * 0.8).toFixed(2) : ride.money.pricePerRider}</Text>
      </View>
    </View>
  )
}

export default RideCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '4%',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: '#d9d9d9',
    borderBottomColor: '#d9d9d9',
    paddingLeft: '5.4%',
    paddingRight: '4%',
  },
  activeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '4%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
    // borderTopWidth: 0.5,
    // borderTopColor: '#d9d9d9',
    backgroundColor: '#f2f2f2',
    borderLeftColor: 'red',
    borderLeftWidth: '6%',
    paddingHorizontal: '4%',
  },
  locationContainer: {
    maxWidth: '87%'
  },
  dropoffText: {
    fontSize: 17,
    fontWeight: 500
  },
  pickupLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%'
  },
  priceText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500
  }
})