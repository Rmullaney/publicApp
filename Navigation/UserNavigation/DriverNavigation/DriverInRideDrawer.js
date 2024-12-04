import { createDrawerNavigator } from '@react-navigation/drawer';
import DriverInRide from '../../../screens/DriverScreens/DriverInRide/DriverInRide';
import SettingsContactAdmin from '../../../screens/Settings/SettingsContactAdmin/SettingsContactAdmin';

const Drawer = createDrawerNavigator();


export default function DriverInRideDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'red',
      }}
    >
      <Drawer.Screen name='DriverInRide' component={DriverInRide} options={() => ({
        presentation: 'modal'
      })}/>
      <Drawer.Screen name='SettingsContactAdmin' component={SettingsContactAdmin}/>
    </Drawer.Navigator>
  );
}