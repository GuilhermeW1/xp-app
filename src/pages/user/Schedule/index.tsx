import { RouteProp, useRoute } from '@react-navigation/native';
import { Text } from '../../../components/Text';
import { Container } from './styles';
import { RootStackParamList } from '../../../types/Rotues';

type RouteProps = RouteProp<RootStackParamList, 'Schedule'>

export function Schedule(){
  const route = useRoute<RouteProps>();
  const params = route.params;

  return(
    <Container>
      <Text>{params?.price}</Text>
    </Container>
  );
}
