import { createDrawerNavigator } from '@react-navigation/drawer';

import SettingsHome from '../../../screens/Settings/SettingsHome/SettingsHome';
import SettingsWallet from '../../../screens/Settings/SettingsWallet/SettingsWallet';
import SettingsProfile from '../../../screens/Settings/SettingsProfile/SettingsProfile';
import SettingsLegal from '../../../screens/Settings/SettingsLegal/SettingsLegal';
import HelpStack from './HelpStack';

const Drawer = createDrawerNavigator();

export default function SettingsDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'red',
        drawerPosition: 'right'
      }}
      initialRouteName='Home'
    >
      <Drawer.Screen name="Home" component={SettingsHome} />
      <Drawer.Screen name="SettingsProfile" component={SettingsProfile} options={{ title: 'Account'}}/>
      <Drawer.Screen name="Wallet" component={SettingsWallet} />
      <Drawer.Screen name="HelpStack" component={HelpStack} options={{ title: 'Help'}}/>
      <Drawer.Screen name="Legal" component={SettingsLegal} />
    </Drawer.Navigator>
  );
}