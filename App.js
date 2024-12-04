import 'expo-dev-client';
import 'react-native-gesture-handler';

import React from 'react';
import RootNavigation from './Navigation/Index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51NXW2WBKdp0jVgefQr2RdY2qAgCEfJkN3aJ2OUP729irG3EWJor86XcROo5D9kaYcuC1qwNFWVnC08aWSwqpqRo000BayCVN06'

export default function App() {

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
    >
      <ActionSheetProvider>

        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <RootNavigation />
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </ActionSheetProvider>
    </StripeProvider>
  );
}