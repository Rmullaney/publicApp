import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

const LUGGAGE_CHOICES = [
  {
    size: 'Small',
    measurements: '(23" - 24")'
  },
  {
    size: 'Medium',
    measurements: '(25" - 26")'
  },
  {
    size: 'Large',
    measurements: '(27" - 31")'
  },
];

const AddLuggageModal = (props) => {
  
  const addLuggage = () => {
    props.setRide({
      ...props.ride,
      luggage: {
        hasLuggate: true,
        smallLuggageCount,
        mediumLuggageCount,
        largeLuggageCount
      }
    })

    props.toggleAddLuggageModal();
  }

  // If luggage options should be shown
  const [smallLuggageCount, setSmallLuggageCount] = useState(props.ride.luggage.smallLuggageCount);
  const [mediumLuggageCount, setMediumLuggageCount] = useState(props.ride.luggage.mediumLuggageCount);
  const [largeLuggageCount, setLargeLuggageCount] = useState(props.ride.luggage.largeLuggageCount);

  return (
    <Modal
      isVisible={true}
      animationIn={'slideInUp'}
      animationOut={'slideInDown'}
      animationType={'slide'}
      backdropOpacity={0}
      style={styles.modal}
    // onSwipeComplete={() => setShowDatePicker(false)}
    // swipeDirection="down"
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Add Luggage</Text>
      </View>

      <View style={styles.allLuggageContainer}>
        <Luggage
          luggage={LUGGAGE_CHOICES[0]}
          luggageCount={smallLuggageCount}
          setLuggaeCount={setSmallLuggageCount}
        />
        <Luggage
          luggage={LUGGAGE_CHOICES[1]}
          luggageCount={mediumLuggageCount}
          setLuggaeCount={setMediumLuggageCount}
        />
        <Luggage
          luggage={LUGGAGE_CHOICES[2]}
          luggageCount={largeLuggageCount}
          setLuggaeCount={setLargeLuggageCount}
        />
      </View>

      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            props.toggleAddLuggageModal()
            props.toggleChooseARideBottomSheet()
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            // setPickupDate(date)
            addLuggage()
            props.toggleAddLuggageModal()
            props.toggleChooseARideBottomSheet()
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        </View>
    </Modal>
  )
}

const Luggage = ({ luggage, luggageCount, setLuggaeCount }) => {
  return (
    <View style={styles.luggageContainer}>
      <View style={styles.luggageLeftView}>
        <Text style={styles.sizeText}>{luggage.size} {luggage.measurements}</Text>
      </View>

      <View style={styles.luggageRightView}>
        <TouchableOpacity
          style={styles.addMinusButton}
          onPress={() => (luggageCount > 0 && setLuggaeCount(luggageCount - 1))}
        >
          <AntDesign name="minuscircleo" size={22} color="#A19F9F" />
        </TouchableOpacity>

        <View style={styles.luggageCountContainer}>
          <Text style={styles.luggageCountText}>{luggageCount}</Text>
        </View>

        <TouchableOpacity
          style={styles.addMinusButton}
          onPress={() => { luggageCount < 9 && setLuggaeCount(luggageCount + 1) }}
        >
          <AntDesign name="pluscircleo" size={22} color="#A19F9F" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddLuggageModal

const styles = StyleSheet.create({
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: '4%',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white',
    margin: 0,
    paddingBottom: '8%',
    marginTop: '148%',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 20,
    paddingVertical: '2%',
    paddingHorizontal: '6%',
    marginRight: '4%',
    justifyContent: 'center'
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 700,
  },
  confirmButton: {
    backgroundColor: 'red',
    paddingVertical: '2%',
    paddingHorizontal: '6%',
    borderRadius: 20,
    marginLeft: '4%',
    justifyContent: 'center'
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16
  },
  headerText: {
    fontSize: 34,
    fontWeight: 700
  },
  headerContainer: {
    paddingHorizontal: '6%',
    marginBottom: '3%'
  },
  allLuggageContainer: {

  },
  sizeText: {
    fontSize: 18,
  },
  luggageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    marginBottom: '2%'
  },
  luggageLeftView: {
    flex: 1
  },  
  luggageRightView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  addMinusButton: {
    paddingHorizontal: '4%'
  },
  luggageCountText: {
    fontSize: 18
  },
  luggageCountContainer: {
    width: '6%'
  },
})