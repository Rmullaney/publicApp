import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import UpcomingRideContent from "./UpcomingRideContent";

const UpcomingRide = (props) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        props.setModalRide(props.ride)
        props.toggleShowDetailsModal()
        props.handleClose(props.homeBottomSheet)
      }}
    >
      <UpcomingRideContent ride={props.ride} homeBottomSheetRef={props.homeBottomSheet}/>
    </Pressable>
  );
};

export default UpcomingRide;