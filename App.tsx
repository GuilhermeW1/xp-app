import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import Main from './src/main';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isFontsLoaded] = useFonts({
    'GeneralSans-400': require('./src/assets/fonts/regular.otf'),
    'GeneralSans-600': require('./src/assets/fonts/semi.otf'),
    'GeneralSans-700': require('./src/assets/fonts/bold.otf'),
  });

  if(!isFontsLoaded){
    return null;
  }
  return (
    <>
      <Main/>
      <StatusBar style='dark'/>
    </>
  );
}

