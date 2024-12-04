import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../API/firbaseConfig";

import { Ionicons } from '@expo/vector-icons';

//lodge a complaint
export default function SettingsContactAdmin({ navigation }) {
  const [userinfo, setUserinfo] = useState({ NonEmergencyContact: "", EmergencyContact: "" });
  useEffect(() => {
    // fetch data
    const unsub = onSnapshot(
      doc(firestore, "users", "PyUkTFCXaYFeQhgJkURh"),
      (doc) => {
        setUserinfo(doc.data());
      }
    );
    return () => unsub();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topButtonContainer}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => { navigation.goBack() }}
            >
              <Ionicons name="chevron-back-sharp" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Contact Admin
          </Text>
          {/* <Text style = {styles.subtitle}>Inquries?</Text> */}
          <Text style={styles.email}>RaiderRides@gmail.com</Text>
          <View style={styles.line} />
          <Text style={styles.subtitle}>Our Team:</Text>
        
        {/* infocard 1 */}
          <View style={styles.teamContainer}>
            <View style={styles.teamImagePlaceholder}>
              {/* Placeholder Image */}
              <Text>Image Placeholder</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style = {styles.teaminfotxt}>Bruce Wayne</Text>
              <Text style = {styles.teaminfotxt}>BWayane@colgate.edu</Text>
            </View>
          </View>
        
        {/* infocard 2 */}
          <View style={styles.teamContainer}>
            <View style={styles.teamImagePlaceholder}>
              {/* Placeholder Image */}
              <Text>Image Placeholder</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style = {styles.teaminfotxt}>Clark Kent</Text>
              <Text style = {styles.teaminfotxt}>Ckent@colgate.edu</Text>
            </View>
          </View>

        {/* infocard 3 */}
          <View style={styles.teamContainer}>
            <View style={styles.teamImagePlaceholder}>
              {/* Placeholder Image */}
              <Text>Image Placeholder</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style = {styles.teaminfotxt}>Diana Prince</Text>
              <Text style = {styles.teaminfotxt}>DPrince@colgate.edu</Text>
            </View>
          </View>
        </View>
        
        {/* red circle */}
        {/* <View style={styles.redCircle} /> */}

      </View>
    </SafeAreaView>
  )
}

const Link = ({ title, navigation }) => {
  return (
    <Pressable
      onPress={() => { navigation.navigate(`${title}`) }}
    >
      <View style={styles.linkContainer}>
        <View style={styles.linkLeftView}>
          <Text style={styles.linkTitle}>{title}</Text>
        </View>

        <View style={styles.linkRightView}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </View>
    </Pressable>
  )
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingTop: '2%',
  },
  topButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '6%'
  },
  backButtonContainer: {
    alignItems: 'flex-start',
    flex: 1
  },
  headerContainer: {
    marginTop: '6%',
    marginLeft: '2%',
    marginBottom: '4%'
  },
  headerText: {
    fontSize: 28,
    fontWeight: 600,
    color: 'red'
  },
  linkContainer: {
    flexDirection: 'row',
    padding: '4%',
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 0.5,
    alignItems: 'center'
  },
  linkLeftView: {
    flex: 1,
    alignItems: 'flex-start'
  },
  linkRightView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  linkTitle: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 490,
    paddingTop: 25,
    alignItems: 'center',
    color: 'black',
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 25, 
    textAlign: 'center',
  },
  line: {
    borderBottomColor: 'red',
    borderBottomWidth: 1, 
    marginHorizontal: 'auto', 
    marginTop: 10, 
  },
  //the red box info card 
  teamContainer: {
    backgroundColor: 'red',
    borderRadius: 10, 
    flexDirection: 'row',
    padding: 20, 
    alignItems: 'center',
    marginTop: 20,
  },
  // Style for the placeholder image
  teamImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Style for the team info
  teamInfo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  //the text inside the team infocard
  teaminfotxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  redCircle: {
    backgroundColor: 'darkred',
    width: 750,
    height: 750,// same as the width
    borderRadius: 370, // Half of the height
    alignSelf: 'center',
    bottom:"-5%",
  },
});
