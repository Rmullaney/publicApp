import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../API/firbaseConfig'
import { getFunctions, httpsCallable } from "firebase/functions";
import { usePaymentSheet } from '@stripe/stripe-react-native';

import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

//lodge a complaint
export default function SettingsWallet({ navigation }) {

  const [ready, setReady] = useState(false)
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet()
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    initializePaymentSheet()
    retrievePaymentMethods()
  }, [])


  const initializePaymentSheet = async () => {
    const functions = getFunctions();
    const fetchAddCardPSParams = httpsCallable(functions, 'fetchAddCardPSParams');

    const uid = auth.currentUser.uid;
    const { data } = await fetchAddCardPSParams({
      uid: uid,
    })

    const { error } = initPaymentSheet({
      customerId: data.customer,
      customerEphemeralKeySecret: data.ephemeralKey,
      setupIntentClientSecret: data.setupIntent,
      merchantDisplayName: 'Raider Rides',
      allowsDelayedPaymentMethods: true,

    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      setReady(true)
    }
  }

  const retrievePaymentMethods = async () => {
    const functions = getFunctions();
    const listPaymentMethods = httpsCallable(functions, 'listPaymentMethods');

    const uid = auth.currentUser.uid;
    const { data } = await listPaymentMethods({
      uid: uid,
    })

    setPaymentMethods(Object.values(data.paymentMethodsData))
  }

  const buy = async () => {
    const { error } = presentPaymentSheet().then(() => {
      initializePaymentSheet()
      retrievePaymentMethods()
    })

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      setReady(true)
    }
  }


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
              Wallet
            </Text>
          </View>

          <View style={styles.subheaderContainer}>
            <Text style={styles.subheaderText}>
              Payment Methods
            </Text>
          </View>

          <View style={styles.allCardsContainer}>
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={({ item }) => {
                return (
                  <Card
                    brand={item.card.brand}
                    lastFour={item.card.last4}
                    navigation={navigation}
                    cardId={item.id}
                    setPaymentMethods={setPaymentMethods}
                  />
                )
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
            {/* <Card lastFour={'1111'} navigation={navigation} />
          <Card lastFour={'2222'} navigation={navigation} />
          <Card lastFour={'3333'} navigation={navigation} /> */}
          </View>

          <Pressable
            style={styles.addCardTextContainer}
            onPress={buy}
            disabled={loading || !ready}
          >
            <Text style={styles.addCardText}>Add Payment Method</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const Card = (params) => {
  const imagePath = params.brand === 'visa' ? require(`../../../assets/visa.png`)
    : params.brand === 'discover' ? require(`../../../assets/discover.png`)
      : params.brand === 'mastercard' ? require(`../../../assets/mastercard.png`)
        : require(`../../../assets/american-express.png`)

  const deletePaymentMethod = async () => {
    const functions = getFunctions();
    const detachPaymentMethod = httpsCallable(functions, 'detachPaymentMethod');

    detachPaymentMethod({ cardId: params.cardId }).then(async () => {
      await retrievePaymentMethods()
    })
  }

  const retrievePaymentMethods = async () => {
    const functions = getFunctions();
    const listPaymentMethods = httpsCallable(functions, 'listPaymentMethods');

    const uid = auth.currentUser.uid;
    const { data } = await listPaymentMethods({
      uid: uid,
    })

    params.setPaymentMethods(Object.values(data.paymentMethodsData))
  }

  const deletePaymentMethodConfirmation = () => {
    Alert.alert(
      "Delete Card",
      `Are you sure that you would like to delete the card: ${params.brand} ending in ${params.lastFour}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("no Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => { 
          deletePaymentMethod()
        } },
      ]
    );
  }

  return (
    <Pressable
      onPress={() => { params.navigation.navigate(`${params.lastFour}`) }}
    >
      <View style={styles.cardContainer}>
        <View style={styles.cardLeftView}>
          <View style={styles.imageContainer}>
            <Image source={imagePath} style={styles.image} />
          </View>

          <Text style={styles.cardlastFour}>
            <Text style={styles.dotText}>···· </Text>
            {params.lastFour}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cardRightView}
          onPress={() => deletePaymentMethodConfirmation()}
        >
          <Ionicons name="close-circle-outline" size={24} color="black" />
        </TouchableOpacity>
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
  subheaderContainer: {
    marginLeft: '2%'
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: 500,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: '4%',
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 0.5,
    alignItems: 'center'
  },
  cardLeftView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  cardRightView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  cardlastFour: {
    fontSize: 16,
  },
  dotText: {
    fontWeight: 900
  },
  dummyCard: {
    marginRight: '8%',
    padding: '3%',
    backgroundColor: 'blue',
    borderRadius: 4
  },
  dummyCardText: {
    color: 'white',
    fontWeight: 700
  },
  addCardTextContainer: {
    marginTop: '4%',
    marginLeft: '2%'
  },
  addCardText: {
    fontSize: 16,
    fontWeight: 400,
    color: 'red'
  },
  image: {
    width: 40,
    height: 20,
    marginRight: '8%',
  },
});
