import AppRoutes from './routes';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './context/auth-context';

export default function Main(){
  return(
    <NavigationContainer>
      <AuthContextProvider>
        <AppRoutes/>
      </AuthContextProvider>
    </NavigationContainer>
  );
}
