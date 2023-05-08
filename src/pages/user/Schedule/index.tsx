import { RouteProp, useRoute } from '@react-navigation/native';
import { Text } from '../../../components/Text';
import { Container, Footer, FooterContainer } from './styles';
import { RootStackParamList } from '../../../types/Rotues';
import { Body } from '../Home/styles';
import { Button } from '../../../components/button';

type RouteProps = RouteProp<RootStackParamList, 'Schedule'>

export function Schedule(){
  const route = useRoute<RouteProps>();
  const params = route.params;
  if(!params){
    return;
  }

  return(
    <>
      <Container>
        <Body>

        </Body>
      </Container>
      <Footer>
        <FooterContainer>
          <Text>{params.price}</Text>
          <Text>{params.time}</Text>
          <Button onPress={() => {alert('ola');}}>
            Cancelar Pedido
          </Button>
        </FooterContainer>
      </Footer>
    </>
  );
}
