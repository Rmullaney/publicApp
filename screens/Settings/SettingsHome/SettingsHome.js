import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsPastRides from '../SettingsPastRides/SettingsPastRides';
import { auth, firestore } from "../../../API/firbaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import { DisplayImage } from '../../../API/imageMethods';
//import SettingsLegal from "../../../screens/Settings/SettingsLegal/SettingsLegal";

const SettingsHome = ({ navigation }) => {

  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnDoe@gmail.com',
    totalRides: 18,
    moneySpent: 75,
  })

  //check to flip onto the inRide stack
  useEffect(() => {

    //user reference
    const userRef = doc(firestore, 'users', auth.currentUser.uid);

    //does the work to see if nav needs to be changed
    const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        totalRides: data.totalRides,
        money: data.moneySpent,
      })
    });
  

    return () => unsubscribe();
  }, []); 



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.outerContainer}>
        <View style={styles.headerContainer}>
          <DisplayImage uid={auth.currentUser.uid} iconSize={60} style={styles.DispImStyle}/>
          {//<TouchableOpacity style={styles.dummyPic}></TouchableOpacity>
          }
          <View>
            <Text style={styles.headerName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.headerEmail}>{user.email}</Text>
          </View>

          <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'center' }}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="ios-menu-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={[styles.statContainer, styles.firstStat]}>
            <Text style={styles.bodyText}>
              <Text style={styles.numberText}>{user.totalRides} </Text>
              total rides
            </Text>
          </View>

          <View style={[styles.statContainer, styles.secondStat]}>
            <Text style={styles.bodyText}>
              <Text style={styles.numberText}>${user.money} </Text>
              saved
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsProfile')}
            style={styles.button}
          >
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Wallet')}
            style={styles.button}
          >
            <Ionicons name="wallet-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('HelpStack')}
            style={styles.button}
          >
            <Ionicons name="ios-help-circle-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Legal')}
            style={styles.button}
          >
            <Ionicons name="ios-newspaper-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Legal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ridesContainer}>
          <Text style={styles.pastRidesText}>Past Rides</Text>
          <SettingsPastRides />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingsHome;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '5%',
  },
  dummyPic: {
    width: 60,
    height: 60,
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    marginRight: '1%'
  },
  DispImStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: '1%',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 700
  },
  infoContainer: {
    flexDirection: 'row',
    paddingVertical: '3%',
    alignItems: 'center',
    paddingLeft: '2%',
    height: '7%',
  },
  statContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '2%'
  },
  firstStat: {
    borderRightWidth: 1,
    borderRightColor: 'black'
  },
  secondStat: {
    paddingLeft: '2%'
  },
  bodyText: {

  },
  numberText: {
    fontSize: 18,
    fontWeight: 600,
    color: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '10%',
    borderBottomWidth: 1,
    paddingBottom: '4%',
    borderBottomColor: '#d9d9d9',
  },
  button: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    height: '100%',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 10
  },
  ridesContainer: {
    paddingTop: '4%',
  },
  pastRidesText: {
    fontSize: 18,
    fontWeight: 500,
  }
})