import { createStackNavigator } from '@react-navigation/stack';
import CreateAccount from '../pages/unauthenticated/create-account';
import SignIn from '../pages/unauthenticated/signIn';


const Stack = createStackNavigator();

export default function UnathenticateRoutes(){
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={SignIn} name='SignIn'/>
      <Stack.Screen component={CreateAccount} name='CreateAccount'/>
    </Stack.Navigator>
  );
}
