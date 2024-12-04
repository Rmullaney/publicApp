import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DatePickerModal = (props) => {

  const [tempDate, setTempDate] = useState(new Date());

  // useEffect(() => {
  //   props.handleClose(props.homeBottomSheet)
  // }, [])

  const onDateChange = ({ type }, selectedDate) => {
    if (type == 'set') {
      const currentDate = new Date(selectedDate);

      setTempDate(currentDate);
    } else {

    }
  }

  const confirmDate = () => {
    props.setRide({
      ...props.ride,
      pickupDate: tempDate.toUTCString(),
    });
  }
 
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
      <DateTimePicker
        value={tempDate}
        onChange={onDateChange}
        mode='datetime'
        display='inline'
        accentColor='red'
        // style={{ height: '80%', width: '80%' }}
        style={{ width: windowWidth - 50, height: (windowHeight - 150) / 2}}
        themeVariant='light'
        minimumDate={new Date()}
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            props.toggleDatePickerModal()
            props.navigation.goBack()
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            // setPickupDate(date)
            confirmDate()
            props.toggleDatePickerModal()
            props.toggleChooseARideBottomSheet()
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default DatePickerModal

const styles = StyleSheet.create({
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: '4%'
  },
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0,
    paddingBottom: '7%',
    marginTop: '102%',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21
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
})