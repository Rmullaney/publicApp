import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DisplayImage } from '../../../API/imageMethods'

const RiderInfo = ({ user, ride }) => {

  const id = Object.keys(ride.riders).find(key => ride.riders[key] === user) || 'driverTemplate';

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 4,
            marginRight: 4
          }}
        >
          <DisplayImage uid={id} iconSize={36} style={styles.imageJawn}/>
        </TouchableOpacity>
        <Text>{user.firstName} {user.lastName.charAt(0)}.</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text>{user.phoneNumber}</Text>
      </View>
    </View>
  )
}

export default RiderInfo

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: '3%',
    paddingHorizontal: '2%',
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: .5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1
  },
  messageContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  imageJawn: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
})