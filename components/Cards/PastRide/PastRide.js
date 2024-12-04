import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import PastRideContent from "./PastRideContent";

const PastRide = ({ ride }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
      }}
    >
      <PastRideContent ride={ride} />
    </Pressable>
  );
};

export default PastRide;