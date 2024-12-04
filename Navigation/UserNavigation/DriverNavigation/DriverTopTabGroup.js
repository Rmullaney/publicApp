import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import DriverHome from '../../../screens/DriverScreens/DriverHome/IsDriverHome';
// import DriverCreateRide from '../../../screens/DriverScreens/DriverCreateRide/DriverCreateRide';
import DriverMarketplace from '../../../screens/DriverScreens/DriverMarketplace/DriverMarketplace';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

const TopTab = createMaterialTopTabNavigator();


export default function DriverTopTabGroup() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: safeArea.top, backgroundColor: '#fff' }}>
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'capitalize',
            fontWeight: 500,
            fontSize: 18
          },
          tabBarIndicatorStyle: {
            height: 5,
            borderRadius: 3,
            backgroundColor: 'red',
          },
          activeTintColor: "red",
          inactiveTintColor: "grey",
          tabBarStyle: {
            width: 'auto',
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'grey'
        }}
      >
        <TopTab.Screen name="DriverHome" component={DriverHome} options={{ tabBarLabel: 'Home' }} />
        {/* <TopTab.Screen name="CreateRide" component={DriverCreateRide}/> */}
        <TopTab.Screen name="DriverMarketplace" component={DriverMarketplace} options={{ tabBarLabel: 'Market' }} />
      </TopTab.Navigator>
    </View>
  );
}