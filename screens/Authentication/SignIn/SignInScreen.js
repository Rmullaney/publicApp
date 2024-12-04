import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from "react-native";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../API/firbaseConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import DialogInput from "react-native-dialog-input";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = React.useState(false);

  const getErrors = (email, password) => {
    const errors = {};

    if (!email) {
      errors.email = "Enter an email";
    }

    if (!password) {
      errors.password = "Enter a password";
    }

    return errors;
  };

  // const hitchangePassword = () => {
  //   <DialogInput
  //     isDialogVisible={visible}
  //     title={"Forgot Password"}
  //     message={"Please enter your email"}
  //     hintInput={"example@colgte.edu"}
  //     submitInput={(inputText) => {
  //       changePass(inputText), setVisible(false);
  //     }}
  //     closeDialog={() => setVisible(false)}
  //   ></DialogInput>;
  // };

  const changePass = (inputText) => {
    sendPasswordResetEmail(auth, inputText, null)
      .then(() => {
        alert("a password link has been sent to: " + inputText);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  async function signIn() {
    const errors = getErrors(email, password);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        setUser(auth.currentUser.uid);
        if (!auth.currentUser.emailVerified) {
          signOut(auth)
            .then(() => {
              alert("Please verify email before sign in");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } catch (error) {
      console.log(error.message);
      setErrors({ firebase: "Email or password incorrect." });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={require('../../../assets/RaiderRidesLogo.png')} style={styles.image} />
            <Text style={styles.headerText}>
              Login today to share a ride and save money!
            </Text>
          </View>

          {errors.firebase && (
            <View style={styles.loginErrorContainer}>
              <Text style={styles.loginErrorText}>{errors.firebase}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
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

            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setVisible(true)}>
              <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={signIn}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.seperatorContaier}>
            <View style={styles.lineView}></View>
            <Text>Or login with</Text>
            <View style={styles.lineView}></View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.dummyGoogleButton}
              onPress={() => { }}
            >
              <Text style={{ fontSize: 18 }}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpLinkContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text style={styles.linkText}>Register here!</Text>
            </TouchableOpacity>
            {/* <DialogInput
              isDialogVisible={visible}
              title={"Forgot Password"}
              message={"Please enter your email"}
              hintInput={"example@colgte.edu"}
              submitInput={(inputText) => {
                changePass(inputText), setVisible(false);
              }}
              closeDialog={() => setVisible(false)}
            ></DialogInput> */}
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
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
    fontWeight: 700,
    color: '#fff',
    fontSize: 18
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
  errorText: {
    color: "red",
    marginTop: "-2%",
    marginBottom: "2%",
  },
  loginErrorContainer: {
    backgroundColor: "red",
    marginTop: "2%",
    paddingVertical: "1%",
    paddingHorizontal: "2%",
  },
  loginErrorText: {
    color: "#fff",
  },
  forgotPasswordButton: {
    paddingBottom: '2%'
  },
  forgotPasswordButtonText: {
    color: 'red'
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: '4%'
  },
});
