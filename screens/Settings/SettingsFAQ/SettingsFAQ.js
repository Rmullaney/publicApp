import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

//lodge a complaint
export default function SettingsFAQs({ navigation }) {

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
            FAQs
          </Text>
        </View>
        
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
  }
});
