import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

//lodge a complaint
export default function SettingsLegal({ navigation }) {

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
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

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Legal
          </Text>
        </View>

        <View>
          <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/raider-rides-app.appspot.com/o/images%2FtermsOfService%2FTOS_example.jpeg?alt=media&token=df7183b1-7956-4c92-b3c9-e4631cd47545&_gl=1*ibpi4g*_ga*MTE5NDQ5NjEyNi4xNjg0NzM1OTQ3*_ga_CW55HF8NVT*MTY5ODE4MzY2Ny4yMTIuMS4xNjk4MTg0MzU2LjkuMC4w' }} />
          <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/raider-rides-app.appspot.com/o/images%2FtermsOfService%2FTOS_example.jpeg?alt=media&token=df7183b1-7956-4c92-b3c9-e4631cd47545&_gl=1*ibpi4g*_ga*MTE5NDQ5NjEyNi4xNjg0NzM1OTQ3*_ga_CW55HF8NVT*MTY5ODE4MzY2Ny4yMTIuMS4xNjk4MTg0MzU2LjkuMC4w' }} />
        </View>

      </ScrollView>
    </SafeAreaView>
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
  menuContainer: {
    alignItems: 'flex-end',
    flex: 1,
    top: '.5%'
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
  image: {
    height: 470,
    width: '100%',
  }
});
