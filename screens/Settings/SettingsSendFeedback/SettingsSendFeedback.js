import { View, Text, StyleSheet, TouchableOpacity, Pressable, Keyboard, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { addDataToFirebase } from '../../../API/firestoreMethods';

//lodge a complaint
export default function SettingsSendFeedback({ navigation }) {

  const [feedback, setFeedback] = useState('');
  const [selectedButton, setSelectedButton] = useState('');

  const sendFeedback = async () => {
    addDataToFirebase('feedback', {
      feedback,
      type: selectedButton
    }).then(() => {
      Alert.alert('Success', 'Thank you for your feedback.', [
        {text: 'OK', onPress: () => setFeedback('')},
      ]);
    })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        style={styles.container}
        onPress={() => Keyboard.dismiss()}
      >
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
            Send Feeback
          </Text>
        </View>

        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>Do you have any suggestions or found some bug? Let us know in the field below.</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={feedback}
            style={styles.input}
            placeholder='Describe your issue or idea...'
            multiline={true}
            textAlign='flex-start'
            maxLength={300}
            onChangeText={(text) => setFeedback(text)}
          />
          <View style={styles.characterCountContainer}>
            <Text style={styles.characterCount}>
              {feedback.length} / 300
            </Text>
          </View>

        </View>

        <View style={styles.bottomHalfContainer}>
          <View style={styles.feedbackTypeContainer}>
            <View style={styles.selectButtonContainer}>
              <TouchableOpacity
                style={[styles.selectButton, {
                  backgroundColor: selectedButton === 'Bug' ? 'red' : 'white',
                  borderColor: !(selectedButton === 'Bug') && 'red',
                }]}
                onPress={() => {
                  setSelectedButton('Bug')
                }}
              ></TouchableOpacity>
              <Text style={styles.selectButtonText}>Bug</Text>
            </View>

            <View style={styles.selectButtonContainer}>
              <TouchableOpacity
                style={[styles.selectButton, {
                  backgroundColor: selectedButton === 'Comment' ? 'red' : 'white',
                  borderColor: !(selectedButton === 'Comment') && 'red',
                }]}
                onPress={() => {
                  setSelectedButton('Comment')
                }}
              ></TouchableOpacity>
              <Text style={styles.selectButtonText}>Comment</Text>
            </View>

            <View style={styles.selectButtonContainer}>
              <TouchableOpacity
                style={[styles.selectButton, {
                  backgroundColor: selectedButton === 'Other' ? 'red' : 'white',
                  borderColor: !(selectedButton === 'Other') && 'red',
                }]}
                onPress={() => {
                  setSelectedButton('Other')
                }}
              ></TouchableOpacity>
              <Text style={styles.selectButtonText}>Other</Text>
            </View>
          </View>

          <View style={styles.sendFeedbackButtonContainer}>
            <TouchableOpacity
              style={styles.sendFeedbackButton}
              onPress={() => {
                sendFeedback()
                Keyboard.dismiss()
              }}
            >
              <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
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
  // linkContainer: {
  //   flexDirection: 'row',
  //   padding: '4%',
  //   borderBottomColor: '#d9d9d9',
  //   borderBottomWidth: 0.5,
  //   alignItems: 'center'
  // },
  // linkLeftView: {
  //   flex: 1,
  //   alignItems: 'flex-start'
  // },
  // linkRightView: {
  //   flex: 1,
  //   alignItems: 'flex-end'
  // },
  // linkTitle: {
  //   fontSize: 16,
  // },
  subheaderContainer: {
    marginHorizontal: '2%'
  },
  subheaderText: {
    fontSize: 16,
    fontWeight: 400
  },
  inputContainer: {
    flex: 1,
    marginTop: '2%',
    padding: '2%'
  },
  input: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    borderRadius: 10,
    paddingHorizontal: '4%',
    paddingTop: '4%'
  },
  bottomHalfContainer: {
    flex: 1
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    marginLeft: '4%',
    marginTop: '1%'
  },
  selectButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '6%'
  },
  selectButton: {
    height: 18,
    width: 18,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectButtonText: {
    paddingLeft: '2%'
  },
  sendFeedbackButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%'
  },
  sendFeedbackButton: {
    backgroundColor: 'red',
    paddingVertical: '2%',
    paddingHorizontal: '26%',
    borderRadius: 20
  },
  sendFeedbackButtonText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff'
  },
  characterCountContainer: {
    bottom: '10%',
    left: '84%'
  },
  characterCount: {
    color: '#d9d9d9'
  }
});
