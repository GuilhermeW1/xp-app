
import { createStackNavigator } from '@react-navigation/stack';
import HomeUser from '../pages/user/Home';
import type { RootStackParamList } from '../types/Rotues';
import { User } from '../pages/user/user';

const Stack = createStackNavigator<RootStackParamList>();

export default function UserRoutes(){
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={User} name='User'/>
      <Stack.Screen  component={HomeUser} name='HomeUser'/>
    </Stack.Navigator>
  );
}


