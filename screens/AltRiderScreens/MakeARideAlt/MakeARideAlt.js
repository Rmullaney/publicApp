import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const apiKey = "";
//These predefined places are drawing their route, distance and thus pricing from their description and not location
//Be careful when implementing new predefined places
//If there are dublicates of a predefined location it can mess up and send you to the wrong place 
//i.e: hall of presidents drawing a line to the hall of presidents in florida  
predefinedPlaces = [
  {
    type: 'recommended',
    description: 'Frank Dining Hall',
    location: 'Frank Dining Hall',
    geometry: { location: { lat: 42.816318216758646, lng: -75.53686985305964 } },
  },
  {
    type: 'recommended',
    description: 'James C. Colgate Student Union',
    location: 'Student Union',
    geometry: { location: { lat: 42.81816304558735, lng: -75.53903864602506 } },//42.81816304558735, -75.53903864602506
  },
  {
    type: 'recommended',
    description: 'Colgate Bookstore',
    location: 'Colgate Bookstore',
    geometry: { location: { lat: 42.827094530180624, lng: -75.54502716136612 } },
  },
  {
    type: 'recommended',
    description: "Syracuse Hancock In'tl Airport",
    location: "Syracuse Hancock In'tl Airport",
    geometry: { location: { lat: 43.114094575103486, lng: -76.11366601717272 } },
  },
  {
    type: 'recommended',
    description: 'Utica Train Station',
    location: 'Utica Train Station',
    geometry: { location: { lat: 43.10443150111484, lng: -75.22366129942384 } },
  },
  {
    type: 'recommended',
    location: 'Class of 1965 Arena',
    description: 'Class of 1965 Arena',
    geometry: { location: { lat: 42.81717230879949, lng: -75.54445645328826 } },
  },
]

const MakeARideAlt = (props) => {
  const pickupInput = useRef();
  const dropoffInput = useRef();
  const modalRef = useRef();

  const [ride, setRide] = useState({
    riders: {},
    driver: {},
    pickupLocation: '',
    pickupCoordinates: {},
    pickupDate: new Date().toISOString(),
    dropoffLocation: '',
    dropoffCoordinates: {},
    driverDone: false,
    distance: 0,
    money: {},
    luggage: {
      hasLuggage: false,
      smallLuggageCount: 0,
      mediumLuggageCount: 0,
      largeLuggageCount: 0
    },
    createdAt: new Date().toISOString(),
    numOfWriters: 1,
    numOfRiders: 1,
    status: 'pendingDriver'
  })

  useEffect(() => {
    if(ride.pickupLocation && ride.dropoffLocation) {
      setIsVisible(false)
      props.navigation.navigate('ChooseARide', {ride})
      props.toggleLocationModal()
    }
  }, [ride.pickupLocation, ride.dropoffLocation])

  // Sets the location information to later be sent to firestore
  const setPickupDetails = (coordinates, location) => {
    setRide({
      ...ride,
      pickupCoordinates: coordinates,
      pickupLocation: location
    })
  }

  const setdropoffCoordinates = (coordinates, location) => {
    setRide({
      ...ride,
      dropoffCoordinates: coordinates,
      dropoffLocation: location
    })
  }

  const [isVisible, setIsVisible] = useState(true)

  return (
    <Modal
      ref={modalRef}
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
            props.toggleLocationModal()
            props.handleSnapPress(1, props.homeBottomSheet)
          }}
        >
          <Ionicons name="close-sharp" size={34} color="black" />
        </TouchableOpacity>

        <GooglePlacesAutocomplete
          placeholder='Pickup location'
          ref={pickupInput}
          onPress={(data, details = null) => {
            setPickupDetails(details.geometry.location, data.description)
            dropoffInput.current.focus()
            // console.log(props.ride)
            // handleSnapPress(1);
          }}
          query={{
            key: apiKey,
            language: 'en',
            components: 'country:us',
          }}
          styles={{
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
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          debounce={200}
          renderLeftButton={() => <MaterialIcons name="location-pin" size={24} color="red" />}
          suppressDefaultStyles
          predefinedPlaces={predefinedPlaces}
          renderRow={(data, index) => (
            <View style={styles.rowContainer}>
              <MaterialIcons name="location-pin" size={24} color="red" />
              <View>
                {!data.structured_formatting ?
                  <Text style={[styles.mainLocation]}>{data.description}</Text>
                  : (
                    <View>
                      <Text style={styles.mainLocation}>
                        {data.structured_formatting.main_text}
                      </Text>
                      <Text style={styles.secondaryLocation}>
                        {data.structured_formatting.secondary_text}
                      </Text>
                    </View>
                  )}

              </View>
            </View>
          )}
          textInputProps={{
            // autoFocus: true,
            selectionColor: 'red',
            placeholderTextColor: 'grey'
          }}
          keyboardShouldPersistTaps='handled'
          isRowScrollable={false}
        />

        <GooglePlacesAutocomplete
          placeholder='Where to?'
          ref={dropoffInput}
          onPress={(data, details = null) => {
            setdropoffCoordinates(details.geometry.location, data.description)
            pickupInput.current.focus()
            // handleSnapPress(1);
          }}
          query={{
            key: apiKey,
            language: 'en',
            components: 'country:us',
          }}
          styles={{
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
              top: '100%',
              position: 'absolute',
            },
            row: {
              paddingVertical: '3%',
              marginHorizontal: '3%',
              borderBottomWidth: .5,
              borderBottomColor: '#d9d9d9',
              paddingLeft: '1%',
            }
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          debounce={200}
          renderLeftButton={() => <MaterialIcons name="search" size={24} color="red" />}
          suppressDefaultStyles
          predefinedPlaces={predefinedPlaces}
          renderRow={(data, index) => (
            <View style={styles.rowContainer}>
              <MaterialIcons name="location-pin" size={24} color="red" />
              <View>
                {!data.structured_formatting ?
                  <Text style={[styles.mainLocation]}>{data.description}</Text>
                  : (
                    <View>
                      <Text style={styles.mainLocation}>
                        {data.structured_formatting.main_text}
                      </Text>
                      <Text style={styles.secondaryLocation}>
                        {data.structured_formatting.secondary_text}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
          )}
          textInputProps={{
            autoFocus: true,
            selectionColor: 'red',
            placeholderTextColor: 'grey'
          }}
          keyboardShouldPersistTaps='always'
        />

      </View>
    </Modal>
  )
}

export default MakeARideAlt

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputsContainer: {
    flex: 1,
    paddingTop: '14%'
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
    marginLeft: '5%',
    marginBottom: '2%'
  }
})
