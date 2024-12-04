import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import RiderPendingRideContent from "./RiderPendingRideContent";

const RiderPendingRide = ({ ride }) => {
  const navigation = useNavigation();

  // setModalRide(ride)
  // setShowModal(true)
  return (
    <Pressable
      onPress={() => {
      }}
    >
      <RiderPendingRideContent ride={ride} />
    </Pressable>
  );
};

export default RiderPendingRide;