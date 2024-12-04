import { View, TouchableOpacity, Text, Alert, StyleSheet, Image, Icon } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../../API/firbaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { imageSelect } from "../../../API/imageMethods";
import { ScrollView } from "react-native-gesture-handler";

export default function SettingsProfile({ navigation }) {
  const [userinfo, setUserinfo] = useState(undefined);
  useEffect(() => {
    // fetch data
    const unsub = onSnapshot(
      doc(firestore, "users", auth.currentUser.uid),
      (doc) => {
        setUserinfo(doc.data());
      }
    );
    return () => unsub();
  }, []);

  const doImageSelect = async () => {
    const userDoc = doc(firestore, "users", auth.currentUser.uid);
    imageSelect(userDoc, 'profilePicture');
  }


  return (
    (typeof userinfo === "undefined" ? null :
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menu}
                onPress={() => { navigation.openDrawer() }}
              >
                <Ionicons name="ios-menu-outline" size={30} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Account
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={userinfo.profilePicture ? styles.image : styles.dummyLogo}
                onPress={() => doImageSelect()}
              > 
                {userinfo.profilePicture ? <Image style={styles.image} source={{uri: userinfo.profilePicture.url}}/> : <Icon name={"camera"} size={30} color="red" type="entypo" />}
              </TouchableOpacity>
            </View>
 
            <View style={styles.infoContainer}>
              <Text style={styles.boldText}>Full name</Text>
              <Text style={styles.bodyText}>{userinfo.firstName} {userinfo.lastName}</Text>
            </View>

            <View style={styles.emailPasswordContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.boldText}>Email</Text>
                <Text style={styles.bodyText}>{userinfo.email}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => alertChangePass(userinfo.email)}
                >
                  <Text style={styles.buttonText}>Change password</Text>
                </TouchableOpacity>
              </View>
            </View>

            <DisplayAccountType userDetails={userinfo} navigation={navigation}/>
            <DisplayDriverStats userDetails={userinfo.driver} />
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  );
}

const DisplayDriverStats = ({ userDetails }) => {
  let content;
  if (userDetails.isDriver) {
    content = (
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.boldText}>Driver's license</Text>
          <Text style={styles.bodyText}> {userDetails.driversLicenseNumber}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.boldText}>Car information</Text>

          <View style={styles.subInfoContainer}>
            <Text style={styles.subBoldText}>License plate</Text>
            <Text style={styles.bodyText}> {userDetails.car.licensePlate}</Text>
          </View>

          <View style={styles.subInfoContainer}>
            <Text style={styles.subBoldText}>Make</Text>
            <Text style={styles.bodyText}> {userDetails.car.make}</Text>
          </View>

          <View style={styles.subInfoContainer}>
            <Text style={styles.subBoldText}>Model</Text>
            <Text style={styles.bodyText}> {userDetails.car.model}</Text>
          </View>

          <View style={styles.subInfoContainer}>
            <Text style={styles.subBoldText}>Color</Text>
            <Text style={styles.bodyText}> {userDetails.car.color}</Text>
          </View>

          <View style={styles.subInfoContainer}>
            <Text style={styles.subBoldText}>Max passengers</Text>
            <Text style={styles.bodyText}> {userDetails.car.maxPassengers}</Text>
          </View>

        </View>
      </View>
    )
  } else {
    content = null;
  }
  return content;
};

const DisplayAccountType = ({userDetails, navigation}) => {
  let content;
  if (userDetails.isAdmin) {
    content = (
      <View style={styles.infoContainer}>
        <Text style={styles.boldText}>Account type</Text>
        <Text style={styles.bodyText}>Admin</Text>
      </View>
    );
  } else if (userDetails.driver.isDriver) {
    content = (
      <View style={styles.infoContainer}>
        <Text style={styles.boldText}>Account type</Text>
        <Text style={styles.bodyText}>Rider and Driver</Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.emailPasswordContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.boldText}>Account type</Text>
          <Text style={styles.bodyText}>Rider</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('DriverStack', {
                screen: 'DriverSignUp'
              })
              console.log('go to driver signup')
            }}
          >
            <Text style={styles.buttonText}>Become a driver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return content;
};

const alertChangePass = (userEmail) => {
  Alert.alert(
    "Confirm change password",
    "Are you sure you would like to change your password?",
    [
      {
        text: "No",
        onPress: () => console.log("no Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          changePass(userEmail);
        },
      },
    ]
  );
};
const changePass = (userEmail) => {
  sendPasswordResetEmail(auth, userEmail, null)
    .then(() => {
      alert("a password link has been sent to: " + userEmail);
    })
    .catch(function (e) {
      console.log(e);
    });
};
 
const styles = StyleSheet.create({
  // button: {
  //   alignItems: "center",
  //   backgroundColor: "#ba0404",
  //   height: 30,
  //   width: 150,
  //   marginTop: 20,
  //   justifyContent: "center",
  // },
  dummyLogo: {
    backgroundColor: '#f2f2f2',
    width: 130,
    height: 130,
    borderRadius: 100,
    marginBottom: 8,
    justifyContent: 'flex-end',
    paddingBottom: '2%'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
  },
  image: {
    height: 130,
    width: 130,
    borderRadius: 100,
  },
  emailPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoContainer: {
    paddingHorizontal: '3%',
    marginBottom: '3%',
  },
  boldText: {
    fontWeight: 700,
    fontSize: 16,
    marginBottom: '1%'
  },
  bodyText: {
    marginLeft: '3%',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: '4%'
  },
  button: {
    // borderWidth: 1,
    // borderColor: 'red',
    paddingHorizontal: '6%',
    paddingVertical: '2.5%',
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'red',
    fontWeight: 500,
    fontSize: 12
  },
  subBoldText: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: '1%'
  },
  subInfoContainer: {
    paddingHorizontal: '4%',
    marginBottom: '2%'
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
    flex: 1,
  },
  menuContainer: {
    alignItems: 'flex-end',
    flex: 1,
    top: '.5%'
  },
  headerContainer: {
    marginTop: '6%',
    marginLeft: '2%',
    // marginBottom: '4%'
  },
  headerText: {
    fontSize: 28,
    fontWeight: 600,
    color: 'red'
  },
});
