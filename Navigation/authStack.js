import SignInScreen from '../screens/Authentication/SignIn/SignInScreen';
import SignUpScreen from '../screens/Authentication/SignUp/SignUpScreen';
import TermsOfService from '../components/TermsOfService';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfService} options={{ presentation: 'modal' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}