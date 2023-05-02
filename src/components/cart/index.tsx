import { FlatList } from 'react-native';
import { Service } from '../../types/service';
import { Text } from '../Text';
import { CartItem } from '../../types/CartItem';
import { Actions, InfoContainer, Item, ServiceInfo, Summary, SummaryInfo } from './styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../button';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/Rotues';

interface CartProps {
  cartItems: CartItem[];
  handleRemoveCartItem: (item: CartItem) => void;
}



export function Cart({cartItems, handleRemoveCartItem}: CartProps){
  const {navigate} = useNavigation<StackNavigationProp<RootStackParamList>>();

  const totalPrice = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.item.price;
  }, 0);

  const totalTime = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.item.time;
  }, 0);

  function formatTime(time: number): string{
    if(time <=59 ){
      return `${time} min`;
    }

    const horas = Math.floor(time/ 60);
    const min = time % 60;
    const textoHoras = (`00${horas}`).slice(-2);
    const textoMinutos = (`00${min}`).slice(-2);

    return `${textoHoras }:${textoMinutos} hora(s)`;

  }

  return(
    <>
      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={cartItem => cartItem.item.id}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 20, maxHeight: 150}}
          renderItem={({item: service}) => (
            <Item>
              <ServiceInfo>
                <Text weight='600' size={14}>{service.item.name}</Text>
                <InfoContainer>
                  <Text size={14} color='#666'>{service.item.time} min</Text>
                  <Text size={14} color='#666'>{formatCurrency(service.item.price)}</Text>
                </InfoContainer>
              </ServiceInfo>
              <Actions
                onPress={() => handleRemoveCartItem(service)}
              >
                <AntDesign name="minuscircleo" size={20} color="red" />
              </Actions>
            </Item>
          )}
        />
      )}
      <Summary>

        <SummaryInfo>
          {cartItems.length == 0 ?
            <Text color='#999'>Nenhum servico selecionado</Text>
            :
            (
              <>
                <Text style={{marginTop: 8}}>Tempo</Text>
                <Text weight='600'>{formatTime(totalTime)}</Text>
                <Text>Total</Text>
                <Text weight='600'>{formatCurrency(totalPrice)}</Text>
              </>

            )
          }
        </SummaryInfo>

        <Button
          disabled={cartItems.length === 0}
          onPress={() => navigate('Schedule', {price: totalPrice, time: totalTime})}
        >
          Agendar Horario
        </Button>
      </Summary>
    </>
  );
}
