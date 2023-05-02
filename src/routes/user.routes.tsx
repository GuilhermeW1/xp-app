
import { createStackNavigator } from '@react-navigation/stack';
import HomeUser from '../pages/user/Home';
import { Schedule } from '../pages/user/Schedule';
import type { RootStackParamList } from '../types/Rotues';

const Stack = createStackNavigator<RootStackParamList>();

export default function UserRoutes(){
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen  component={HomeUser} name='HomeUser'/>
      <Stack.Screen component={Schedule} name='Schedule'/>
    </Stack.Navigator>
  );
}


