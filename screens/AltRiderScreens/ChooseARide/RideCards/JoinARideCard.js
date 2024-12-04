import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable } from "react-native";
import JoinARideCardContent from "./JoinARideCardContent";

const JoinARideCard = (props) => {
  // const [active, setActive] = useState(false);
  const navigation = useNavigation();

  // const toggleActive = () => {
  //   setActive(!active);
  // }

  return (
    // <Pressable
    //   onPress={() => {
    //     // toggleActive()
    //     // props.setModalRide(props.ride)
    //     // props.toggleModal()
    //     // props.handleClose()
    //   }}
    // >
      <JoinARideCardContent ride={props.ride} active={props.active}/>
    // </Pressable>
  );
};

export default JoinARideCard;