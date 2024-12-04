import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RiderDetails = (rider) => {

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text>Picture      </Text>
        <Text style={styles.text}>{rider?.rider.firstName} {rider?.rider.lastName?.charAt(0)}.</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.text}>555-555-5555</Text>
      </View>
    </View>
  )
}

export default RiderDetails

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: '4%'
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  right: {
    flex:1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14
  }
})