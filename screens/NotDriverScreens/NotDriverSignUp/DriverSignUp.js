import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { sendDataToFirebase } from '../../../API/firestoreMethods';
import { auth, firestore } from '../../../API/firbaseConfig';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { imageSelect } from '../../../API/imageMethods';
import CheckBox from 'expo-checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const photoTakeOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.8
}

export default function DriverSignUp({ navigation, setIsVisible }) {

  const [image, setImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const [AllValues, SetAllValues] = useState({
    colgID: '',
    dLic: '',
    carInsurPic: '',
    carMake: '',
    carModel: '',
    carColor: '',
    carCapacity: '',
    licPlate: '',
  });

  const userRef = doc(firestore, "users", auth.currentUser.uid);

  const getErrors = (colgID, dLic, carMake, carModel, carColor, carCapacity, licPlate) => {

    const errors = {};

    if (!colgID) {
      errors.colgID = 'Enter a Colgate ID'
    } else if (colgID.length !== 9) {
      errors.colgID = 'Enter a valid Colgate Id'
    }

    if (!dLic) errors.dLic = "Enter a driver's license number";

    if (!carMake) errors.carMake = 'Enter a car make Ex. Honda';

    if (!carModel) errors.carModel = 'Enter a car model Ex. Accord';

    if (!carColor) errors.carColor = 'Enter a car color';

    if (!carCapacity) errors.carCapacity = 'Enter a car capacity';

    if (!licPlate) {
      errors.licPlate = 'Enter a license plate'
    } else if (licPlate.length > 7) {
      errors.licPlate = 'Enter a valid license plate'
    }

    return errors;

  };

  async function buttonPress() {

    const errors = getErrors(AllValues.colgID, AllValues.dLic, AllValues.carMake, AllValues.carModel, AllValues.carColor, AllValues.carCapacity, AllValues.licPlate);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    };

    const doc = await getDoc(userRef);


    /*if (AllValues.colgID === '' || AllValues.dLic === '' || AllValues.carInsurPic === '' || AllValues.carMake === '' || AllValues.carModel === '' || AllValues.carColor === '' || AllValues.carCapacity === '' || AllValues.licPlate === ''){
        SetAllValues({...AllValues, error: 'All fields are mandatory'});
        console.log("Empty");
        return;
    }*/

    try {
      await updateDoc(userRef, {
        'driver.driversLicenseNumber': AllValues.dLic,
        'driver.colgateId': AllValues.colgID,
        'driver.insurancePic': AllValues.carInsurPic,
        'driver.car.color': AllValues.carColor,
        'driver.car.make': AllValues.carMake,
        'driver.car.model': AllValues.carModel,
        'driver.car.licensePlate': AllValues.licPlate,
        'driver.awaitingVerification': true
      });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign Up Page:</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Colgate ID'
          editable
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, colgID: text })}
          keyboardType='numeric'
        />
        {errors.colgID && (
          <Text style={styles.errorText}>{errors.colgID}</Text>
        )}

        <TextInput
          placeholder="Driver's license number"
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, dLic: text })}
          keyboardType='numeric'
        />
        {errors.dLic && (
          <Text style={styles.errorText}>{errors.dLic}</Text>
        )}

        <TextInput
          placeholder='Car Make'
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, carMake: text })}
        />
        {errors.carMake && (
          <Text style={styles.errorText}>{errors.carMake}</Text>
        )}

        <TextInput
          placeholder='Car Model'
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, carModel: text })}
        />
        {errors.carModel && (
          <Text style={styles.errorText}>{errors.carModel}</Text>
        )}

        <TextInput
          placeholder='Car Color'
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, carColor: text })}
        />
        {errors.carColor && (
          <Text style={styles.errorText}>{errors.carColor}</Text>
        )}

        <TextInput
          placeholder='Car Capacity'
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, carCapacity: text })}
          keyboardType='numeric'
        />
        {errors.carCapacity && (
          <Text style={styles.errorText}>{errors.carCapacity}</Text>
        )}

        <TextInput
          placeholder='License Plate Number'
          style={styles.input}
          onChangeText={text => SetAllValues({ ...AllValues, licPlate: text })}
        />
        {errors.licPlate && (
          <Text style={styles.errorText}>{errors.licPlate}</Text>
        )}
      </View>

      <Pressable onPress={() => imageSelect(userRef, 'driver.insurancePic')}>
        <Text style={{ color: 'teal' }}>
          Take Insurance Picture{'\t'}
        </Text>
      </Pressable>

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          style={styles.checkbox}
          color={isChecked && 'red'}
        />
        <Text style={styles.checkboxText}>
          I have reviewed and agree to the
          <Text style={{ color: 'red', fontWeight: 700 }} onPress={() => navigation.navigate('TermsOfService')}> Terms of Service </Text>
          and aknowledge that I am at least 18 years of age.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={buttonPress}>
          <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {
          navigation.navigate('NotDriverHome')
        }}>
          <Text style={[styles.buttonText, { color: 'red' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: "84%",
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
  buttonContainer: {
    // paddingHorizontal: 18,
    width: "84%",
    marginTop: '2%'
  },
  button: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginTop: '-2%',
    marginBottom: '2%',
  },
});