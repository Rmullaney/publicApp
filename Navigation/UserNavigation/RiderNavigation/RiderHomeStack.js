import { createStackNavigator } from "@react-navigation/stack";
import RiderHomeAlt from "../../../screens/AltRiderScreens/RiderHomeAlt/RiderHomeAlt";
import ChooseARide from "../../../screens/AltRiderScreens/ChooseARide/ChooseARide";
import MakeARideAlt from "../../../screens/AltRiderScreens/MakeARideAlt/MakeARideAlt";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

const RiderHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* <Stack.Screen name='RiderTopTabGroup' component={RiderTopTabGroup}/> */}
      {/* <Stack.Screen name='MakeARide' component={MakeARide} options={{headerShown: false}}/> */}
      <Stack.Screen name='RiderHomeAlt' component={RiderHomeAlt}/>
      <Stack.Screen name='ChooseARide' component={ChooseARide} options={{
        // animationTypeForReplace: 'pop'
      }}/>
      <Stack.Screen name='MakeARideAlt' component={MakeARideAlt} options={{presentation: 'modal'}}/> 
      {/* options={{presentation: 'modal'} */}
      {/* cardStyleInterpolator: CardStyleInterpolators. forVerticalIOS, headerShown: false  */}
    </Stack.Navigator>
  )
}

export default RiderHomeStack