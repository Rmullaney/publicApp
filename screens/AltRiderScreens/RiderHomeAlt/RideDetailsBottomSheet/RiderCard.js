import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const RiderCard = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.allUsersContainer}>
        <Image
          style={styles.profilePic}
          source={require('../../../../assets/empty-profile.jpg')}
        />
        {/* <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      /> */}
        <Text style={styles.nameText}>{props.user?.firstName} {props.user?.lastName?.charAt(0)}.</Text>
      </View>

      {props.user?.car && (
        <View style={styles.driverContainer}>
          <View style={styles.carDetailsContainer}>
            <Text style={styles.carMakeText}>{props.user?.car.make} {props.user?.car.model}</Text>
            <Text style={styles.licensePlateText}>{props.user?.car.licensePlate}</Text>
          </View>

          <View style={styles.carPicContainer}>
            <Image
              style={styles.profilePic}
              source={require('../../../../assets/empty-profile.jpg')}
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default RiderCard

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingVertical: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  allUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: '8%'
  },
  nameText: {
    fontSize: 18,
    // fontWeight: 500
  },
  driverContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  carDetailsContainer: {
    alignItems: 'flex-end',
  },
  carPicContainer: {
    alignItems: 'flex-end'
  },
  licensePlateText: {
    fontSize: 16,
    fontWeight: 500
  }
})