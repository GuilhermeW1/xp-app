import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SchedulesPage } from '../pages/admin/schedules-page';
import { ServicesPage } from '../pages/admin/services-page';
import { ConfigurationsPage } from '../pages/admin/configurations-page';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { ProductsPage } from '../pages/admin/products-page';

const Tab = createBottomTabNavigator();


export default function AdminRoutes(){
  return(
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle : {backgroundColor: '#191645'},
      tabBarLabelStyle: {color: '#fff', },
      tabBarActiveTintColor: '#43c6ac',
    }}>
      <Tab.Screen
        name='Agendados'
        component={SchedulesPage}
        options={{tabBarIcon: (opts) => <Feather name='users' size={24} color={opts.focused ? '#43c6ac' : '#fff'}/>}}
      />
      <Tab.Screen
        name='Serviços'
        component={ServicesPage}
        options={{tabBarIcon: (opts) => <MaterialIcons name='attach-money' size={24} color={opts.focused ? '#43c6ac' : '#fff'}

        />}}
      />
      <Tab.Screen
        name='Produtos'
        component={ProductsPage}
        options={{tabBarIcon: (opts) => <Feather name="shopping-bag" size={24} color={opts.focused ? '#43c6ac' : '#fff'}/>}}
      />
      <Tab.Screen
        name='Config'
        component={ConfigurationsPage}
        options={{tabBarIcon: (opts) => <AntDesign name="setting" size={24} color={opts.focused ? '#43c6ac' : '#fff'}/>}}
      />
    </Tab.Navigator>
  );
}
