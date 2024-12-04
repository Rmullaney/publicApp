import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RiderJoinARide from '../RiderJoinARide/RiderJoinARide';

const RiderJoinARideModal = (props) => {
  const [isVisible, setIsVisible] = useState(true)
  const joinARideModalRef = useRef()

  return (
    <Modal
      ref={joinARideModalRef}
      visible={isVisible} //isVisible
      style={styles.container}
      animationType='slide'
      // style={{flex: 1, backgroundColor: '#fff'}}
    >
      {/* <Text>Modal is up</Text>
      <Button title={'close'} onPress={() => {
        setRide({
          ...ride,
          distance: 300
        })
      }} /> */}
      <View style={styles.inputsContainer}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => {
            // props.navigation.goBack()
            // setIsVisible(false);
            props.toggleJoinARideModal()
            props.handleSnapPress(1, props.homeBottomSheet)
          }}
        >
          <Ionicons name="close-sharp" size={34} color="black" />
        </TouchableOpacity>

        <RiderJoinARide navigation={props.navigation} toggleJoinARideModal={props.toggleJoinARideModal}/>
      </View>
    </Modal>
  )
}

export default RiderJoinARideModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputsContainer: {
    flex: 1,
    paddingTop: '14%',
    paddingHorizontal: '4%'
  },
  locationInput: {
    textInputContainer: {
      backgroundColor: '#f2f2f2',
      padding: '2%',
      marginHorizontal: '6%',
      borderRadius: 10,
      flexDirection: 'row',
      marginBottom: '3%'
    },
    textInput: {
      fontSize: 16,
      // backgroundColor: 'pink',
      // paddingLeft: '10%',
      width: '95%'
      // backgroundColor: 'red'
    },
    listView: {
      top: '200%',
      position: 'absolute',
    },
    row: {
      paddingVertical: '3%',
      marginHorizontal: '3%',
      borderBottomWidth: .5,
      borderBottomColor: '#d9d9d9',
      paddingLeft: '1%',
    }
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainLocation: {
    fontWeight: 600,
  },
  secondaryLocation: {
    fontSize: 12
  },
  backButtonContainer: {
    marginBottom: '2%'
  }
})