import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import DriverUpcomingRideContent from '../UpcomingRide/DriverUpcomingRideContent'
const DriverUpcomingRide = ({ ride, setShowModal, setModalRide, handleSnapPress, openModal, bottomSheetModalRef }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        setModalRide(ride)
        // setShowModal(true)
        // handleExpand(bottomSheetModalRef)
        openModal(bottomSheetModalRef)
        handleSnapPress(0, bottomSheetModalRef)
      }}
    >
      <DriverUpcomingRideContent ride={ride} />
    </Pressable>
  );
};

export default DriverUpcomingRide;