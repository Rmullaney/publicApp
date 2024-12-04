import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import PendingRideContent from "./PendingRideContent";

const PendingRide = (props) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        props.setModalRide(props.ride)
        props.toggleShowDetailsModal()
        props.handleClose(props.homeBottomSheet)
      }}
    >
      <PendingRideContent ride={props.ride} homeBottomSheetRef={props.homeBottomSheet}/>
    </Pressable>
  );
};

export default PendingRide;