
import { createStackNavigator } from '@react-navigation/stack';
import HomeUser from '../pages/user/Home';

const Stack = createStackNavigator();

export default function UserRoutes(){
  return(
    <Stack.Navigator>
      <Stack.Screen  component={HomeUser} name='HomeUser'/>
    </Stack.Navigator>
  );
}


