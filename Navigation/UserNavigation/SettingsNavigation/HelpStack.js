import { createStackNavigator } from "@react-navigation/stack";
import SettingsContactAdmin from "../../../screens/Settings/SettingsContactAdmin/SettingsContactAdmin";
import SettingsFAQ from "../../../screens/Settings/SettingsFAQ/SettingsFAQ";
import SettingsSendFeeback from "../../../screens/Settings/SettingsSendFeedback/SettingsSendFeedback";
import SettingsHelp from "../../../screens/Settings/SettingsHelp/SettingsHelp";

const Stack = createStackNavigator();

const HelpStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName='Help'
    >
      <Stack.Screen name='Help' component={SettingsHelp}/>
      <Stack.Screen name='Contact Admin' component={SettingsContactAdmin}/>
      <Stack.Screen name='Send Feedback' component={SettingsSendFeeback}/>
      <Stack.Screen name='FAQs' component={SettingsFAQ}/>
    </Stack.Navigator>
  )
}

export default HelpStack