import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const RiderPaymentSheet = () => {
  const [ready, setReady] = useState(false)
  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet()

  useEffect(() => {
    initializePaymentSheet ()
  }, [])

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Raider Rides',
      allowsDelayedPaymentMethods: true,

    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      setReady(true)
    }
  }

  const buy = async () => {
    const {error} = presentPaymentSheet()

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      setReady(true)
    }
  }

  return (
    <SafeAreaView>
      <Text>Rider</Text>
      <Button title='buy' onPress={buy} disabled={loading || !ready}/>
    </SafeAreaView>
  )
}

export default RiderPaymentSheet

const styles = StyleSheet.create({})