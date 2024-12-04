import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import RiderUpcomingRideContent from "./RiderUpcomingRideContent";

const RiderUpcomingRide = ({ ride, setShowModal, setModalRide }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        setModalRide(ride)
        setShowModal(true)
      }}
    >
      <RiderUpcomingRideContent ride={ride} />
    </Pressable>
  );
};

export default RiderUpcomingRide;