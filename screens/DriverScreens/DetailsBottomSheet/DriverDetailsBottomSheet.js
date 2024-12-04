import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import RiderDetails from './RiderDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RenderLine = () => {
  return (
    <View style={{borderTopColor: '#d9d9d9', borderTopWidth: 0.8}}></View>
  )
}

const DriverDetailsBottomSheet = (props) => {
  if (props.ride.createdAt == undefined) return;

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainerStyle,
      { paddingBottom: safeBottomArea || 6 },
    ],
    [safeBottomArea]
  );

  // variables
  // const snapPoints = useMemo(() => ['35%'], []);

  // Get date info
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthString = (monthNum) => {
    return monthNames[monthNum]
  }

  const dateObject = new Date(props.ride?.pickupDate);

  const hours = dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()
  const min = dateObject.getMinutes()
  const day = dateObject.getDate()
  const month = monthString(dateObject.getMonth());
  const year = dateObject.getFullYear()
  const amOrPm = dateObject.getHours() >= 12 ? 'pm' : 'am'

  const pickupRideEndIndex = props.ride?.pickupLocation.indexOf(",") > 0 ? props.ride?.pickupLocation.indexOf(",") : props.ride?.pickupLocation.length;
  const dropoffRideEndIndex = props.ride?.dropoffLocation.indexOf(",") > 0 ? props.ride?.dropoffLocation.indexOf(",") : props.ride?.dropoffLocation.length

  const numBags = props.ride?.luggage.largeLuggageCount + props.ride?.luggage.mediumLuggageCount + props.ride?.luggage.smallLuggageCount;

  // Array of riders
  // const riders = props.ride && Object.values(props.ride?.riders);

  const riders = [{"firstName": "john", "lastName": 'doe'}, {"firstName": 'else', "lastName": 'anna'}];

  return (
    <BottomSheetModal
      ref={props.bottomSheetModalRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={true}
      animateOnMount={true}
      // onChange={handleSheetChanges}
      handleIndicatorStyle={{
        backgroundColor: '#d9d9d9'
      }}
      // onDismiss={() => {
      //   // props.handleExpand(props.homeBottomSheet)
      //   // props.toggleShowDetailsModal()
      //   props.handleClose(props.bottomSheetModalRef)
      // }}
    >
      <BottomSheetView 
        style={contentContainerStyle}
        onLayout={handleContentLayout}
      >
        <View style={styles.headerContainer}>
        <View style={styles.locationContainer}>
            <Text style={styles.dropoffText}><Text style={{fontWeight: 300}}>Going to</Text> {props.ride?.dropoffLocation.substring(0, dropoffRideEndIndex)}</Text>
            <Text style={styles.subText}><Text style={{fontWeight: 400}}>From </Text><Text style={{fontWeight: 700}}>{props.ride?.pickupLocation.substring(0, pickupRideEndIndex)}</Text></Text>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => props.handleClose(props.bottomSheetModalRef)}
          >
            <Ionicons name="close-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.middleContainer}> 
        <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{month} {day}, {hours}:{min < 10 && 0}{min} {amOrPm}
            </Text>
          </View> 

          <View style={styles.infoContainer}>
            <Text style={styles.subText}>${props.ride?.money?.pricePerRider}</Text>
          </View> 

          <View style={styles.infoContainer}>
            <Ionicons name="ios-people-sharp" size={20} color="black" />
            <Text style={styles.subText}> {props.ride?.numOfRiders} rider</Text>
          </View>

          <View style={styles.infoContainer}>
            <MaterialCommunityIcons name="bag-suitcase" size={20} color="black" />
            <Text style={styles.subText}> {numBags} bags</Text>
          </View>

        </View>
        {/* <View style={styles.headerContainer}>
          <View style={styles.locationContainer}>
            <Text
              style={styles.dropoffText}
              numberOfLines={2}
            >
              {props.ride?.dropoffLocation.substring(0, dropoffRideEndIndex)}
            </Text>

            <Text style={{fontSize: 17}}>
              {props.ride?.pickupLocation.substring(0, pickupRideEndIndex)}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              ${props.ride?.money?.pricePerRider}
            </Text>
          </View>
        </View> */}

        {/* <View style={styles.middleContainer}>
          <Text style={styles.subText}>{month} {day}, {hours}:{min < 10 && 0}{min} {amOrPm}  <Text style={{color: '#d9d9d9'}}>|</Text>  </Text>
          <Text style={styles.subText}>{props.ride?.numOfRiders} rider{props.ride?.numOfRiders > 1 && 's'}  </Text>
          {numBags > 0 && 
            <Text style={styles.subText}>
              <Text style={{color: '#d9d9d9'}}>|</Text>  {numBags} bags
            </Text>
          }
        </View> */}

        <View style={styles.ridersContainer}>
          <FlatList 
            data={riders}
            renderItem={({item}) => <RiderDetails
              rider={item}
            />}
            ItemSeparatorComponent={<RenderLine />}
            scrollEnabled={false}
          />
          {/* {riders.map((item) => (
            <RiderDetails 
              rider={item}
            />
          ))} */}
        </View>

        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>Contact Admin</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};


const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: '5%',
    marginTop: '2%',
  },  
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '2%'
  },
  locationContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: '3.5%',
    // backgroundColor: 'lightblue',
  },
  dropoffText: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: '1.5%',
  },  
  // subText: {
  //   fontSize: 14,
  // },  
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    // backgroundColor: 'pink',
    flex: 1
  },
  priceText: {
    fontSize: 18,
    fontWeight: 500,
    color: 'red',
  },
  middleContainer: {
    flexDirection: 'row',
  },
  editText: {
    color: 'red'
  },
  infoContainer: {
    backgroundColor: '#f2f2f2',
    padding: '2%',
    borderRadius: 3,
    marginRight: '2%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // driverContainer: {
  //   flexDirection: 'row',
  //   marginVertical: '7%',
  // },  
  // pictureContainer: {
  //   marginRight: '10%',
  // },
  ridersContainer: {
    marginVertical: '4%'
  },  
  button: {
    backgroundColor: 'red',
    paddingVertical: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: '1.5%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff'
  },
});


export default DriverDetailsBottomSheet;