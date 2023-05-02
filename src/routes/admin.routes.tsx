import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clients } from '../pages/admin/clients';
import { Dashboard } from '../pages/admin/dashboard';
import { Home } from '../pages/admin/home';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { Container } from './style';

const Tab = createBottomTabNavigator();


export default function AdminRoutes(){
  return(
    <Container>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen
          name='Dashboard'
          component={Dashboard}
          options={{tabBarIcon: ()=> <MaterialIcons name='attach-money' size={24}/>}}
        />
        <Tab.Screen
          name='Home'
          component={Home}
          options={{tabBarIcon: ()=> <AntDesign name='home' size={24}/>}}
        />
        <Tab.Screen
          name='Clients'
          component={Clients}
          options={{tabBarIcon: ()=> <Feather name='users' size={24}/>}}
        />
      </Tab.Navigator>
    </Container>
  );
}
