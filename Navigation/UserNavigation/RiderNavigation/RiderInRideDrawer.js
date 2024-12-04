import { createDrawerNavigator } from '@react-navigation/drawer';
import RiderInRide from '../../../screens/AltRiderScreens/InRide/RiderInRide';
import SettingsContactAdmin from '../../../screens/Settings/SettingsContactAdmin/SettingsContactAdmin';

const Drawer = createDrawerNavigator();


export default function RiderInRideDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'red',
      }}
    >
      <Drawer.Screen name='RiderInRide' component={RiderInRide} options={() => ({
        presentation: 'modal'
      })}/>
      <Drawer.Screen name='SettingsContactAdmin' component={SettingsContactAdmin}/>
    </Drawer.Navigator>
  );
}