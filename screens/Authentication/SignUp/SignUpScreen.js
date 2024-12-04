import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Pressable,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { sendDataToFirebase } from "../../../API/firestoreMethods";
import { auth } from "../../../API/firbaseConfig";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import CheckBox from 'expo-checkbox';

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState({});

  const [isChecked, setIsChecked] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate);
      }
    } else {
      toggleDatepicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(date);
    toggleDatepicker();
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${month}/${day}/${year}`;
  };

  const getErrors = (firstName, lastName, dateOfBirth, phoneNumber, email, password, confirmPassword) => {
    const errors = {};

    if (!firstName) errors.firstName = 'Enter a first name';

    if (!lastName) errors.lastName = 'Enter a last name';

    if (!dateOfBirth) errors.dateOfBirth = 'Enter a birthday';

    if (!email) {
      errors.email = 'Enter an email'
    } else if (!(email.includes('@') || email.includes('@colgate.edu') || email.includes('@gmail.com'))) {
      errors.email = 'Enter a valid email ending in @gmail.com or @colgate.edu'
    }

    if (!phoneNumber) {
      errors.phoneNumber = 'Enter a phone number'
    } else if (phoneNumber.length != 12) {
      errors.phoneNumber = 'Enter a valid phone number'
    }

    if (!password) {
      errors.password = 'Enter a password'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Enter a confirm password";
    } else if (confirmPassword.length < 8) {
      errors.confirmPassword = "Enter correct password";
    } else if (confirmPassword != password) {
      errors.confirmPassword = "Password not matched";
    }

    if (!isChecked) {
      errors.checkBox = "You must read and accept the Terms of Service before proceeding"
    }

    return errors;

  };

  function handleRegister() {
    // const errors = getErrors(email, password, confirmPassword);
    // const errors = getErrors()

    // if (Object.keys(errors).length > 0) {
    //   setShowErrors(true);
    //   setErrors(errors);
    //   console.log(errors);
    const error = getErrors(firstName, lastName, dateOfBirth, phoneNumber, email, password, confirmPassword);

    if (Object.keys(error).length > 0) {
      setShowErrors(true);
      setErrors(error);
    } else {
      setErrors({});
      setShowErrors(false);
      handleSignUp(email, password);
    }
    // } else {
    //   setShowErrors(true)
    // }
  }

  const handleSignUp = async (email, password) => {
    console.log('handling signup')
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (cred) => {
          await sendEmailVerification(cred.user);
          sendDataToFirebase("users", auth.currentUser.uid, {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${auth.currentUser.email}`,
            dateOfBirth: `${dateOfBirth}`,
            driver: { awaitingVerification: false, isDriver: false },
            phoneNumber: `${phoneNumber}`,
          });
        }
      );

      signOut(auth).then(() => {
        alert("Please verify email before sign in");
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{flex: 1}}
        > */}
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
        >
          <View style={styles.headerContainer}>
            <Image source={require('../../../assets/RaiderRidesLogo.png')} style={styles.image} />
            <Text style={styles.headerText}>
              Sign up today to share a ride and save money!
            </Text>
          </View>

          {/* <View>
        <Text style={styles.headerText}>Login today to share a ride and save money!</Text>
      </View> */}

          {/* {!!value.error && (
            <View style={styles.error}>
              <Text>{value.error}</Text>
            </View>
          )} */}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              autoCorrect={false}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              autoCorrect={false}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            {showPicker && (
              <View>
                <DateTimePicker
                  display="spinner"
                  value={date}
                  onChange={onDateChange}
                  maximumDate={new Date("2005-1-1")}
                />
                {Platform.OS === "ios" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={toggleDatepicker}
                      style={styles.datePickerButton}
                    >
                      <Text
                        style={[styles.datePickerButtonText, { color: "red" }]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={confirmIOSDate}
                      style={styles.datePickerButton}
                    >
                      <Text style={styles.datePickerButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {!showPicker && (
              <Pressable onPress={toggleDatepicker}>
                <TextInput
                  placeholder="Birthday"
                  style={styles.input}
                  value={dateOfBirth ? formatDate(dateOfBirth) : ""}
                  onChangeText={setDateOfBirth}
                  autoCorrect={false}
                  editable={false}
                  onPressIn={toggleDatepicker}
                />
                {errors.dateOfBirth && (
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                )}
              </Pressable>
            )}

            <TextInput
              placeholder="Phone number ex. 555-123-4567"
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.phoneNumber &&
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            }

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <View style={styles.checkboxContainer}>
            {/* <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
              style={styles.checkbox}
              color={isChecked && 'red'}
            /> */}
            <Text style={styles.checkboxText}>
              I have reviewed and agree to the
              <Text style={{ color: 'red', fontWeight: 700 }} onPress={() => navigation.navigate('TermsOfService')}> Terms of Service </Text>
              and aknowledge that I am at least 18 years of age.
            </Text>
          </View>

          {errors.checkBox && (
              <Text style={styles.errorText}>{errors.checkBox}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
              <Text style={styles.loginButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.seperatorContaier}>
            <View style={styles.lineView}></View>
            <Text>Or sign up with</Text>
            <View style={styles.lineView}></View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.dummyGoogleButton} onPress={() => { }}>
              <Text style={{ fontSize: 18 }}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpLinkContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
              <Text style={styles.linkText}>Login here!</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {/* </KeyboardAvoidingView> */}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingBottom: ,
  },
  error: {
    margin: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
  inputContainer: {
    width: "80%",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    paddingLeft: 12,
    marginBottom: 8,
    width: "100%",
    borderRadius: 20,
  },
  headerContainer: {
    alignItems: 'center'
  },
  headerText: {},
  buttonContainer: {
    // paddingHorizontal: 18,
    width: "80%",
  },
  loginButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
  },
  seperatorContaier: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  lineView: {
    borderBottomWidth: 1,
    borderColor: "black",
    width: "14%",
    marginHorizontal: 8,
  },
  dummyGoogleButton: {
    padding: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "grey",
  },
  signUpLinkContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  linkText: {
    color: "red",
  },
  dummyLogo: {
    backgroundColor: "#f2f2f2",
    width: 200,
    height: 200,
    marginLeft: "15%",
    borderRadius: 100,
    marginBottom: 8,
  },
  datePickerButton: {
    marginBottom: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: '-2%',
    marginBottom: '2%',
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: '4%'
  },
  checkbox: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: '2%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: '2%',
  },
  checkboxText: {
    fontSize: 12,
    maxWidth: '80%'
  },
});
