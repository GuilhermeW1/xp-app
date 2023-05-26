import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SchedulesPage } from '../pages/admin/schedules-page';
import { ServicesPage } from '../pages/admin/services-page';
import { ConfigurationsPage } from '../pages/admin/configurations-page';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { ProductsPage } from '../pages/admin/products-page';

const Tab = createBottomTabNavigator();


export default function AdminRoutes(){
  return(
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name='Agendados'
        component={SchedulesPage}
        options={{tabBarIcon: () => <Feather name='users' size={24}/>}}
      />
      <Tab.Screen
        name='Serviços'
        component={ServicesPage}
        options={{tabBarIcon: () => <MaterialIcons name='attach-money' size={24}/>}}
      />
      <Tab.Screen
        name='Produtos'
        component={ProductsPage}
        options={{tabBarIcon: () => <Feather name="shopping-bag" size={24} color="black" />}}
      />
      <Tab.Screen
        name='Config'
        component={ConfigurationsPage}
        options={{tabBarIcon: () => <AntDesign name="setting" size={24}/>}}
      />
    </Tab.Navigator>
  );
}
