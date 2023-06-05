import { FlatList } from 'react-native';
import { Text } from '../Text';
import { CartItem } from '../../types/CartItem';
import { Actions, Image, Info, InfoContainer, Item, QuantityCoitaner, ServiceInfo, Summary, SummaryInfo } from './styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../button';
import { AntDesign } from '@expo/vector-icons';
import { SecondaryButton } from '../secondary-button';
import { formatTime } from '../../utils/formatTime';

interface CartProps {
  cartItems: CartItem[];
  handleRemoveCartItem?: (item: CartItem) => void;
  handleSchedule: () => void;
  schedule: boolean;
  handleCancelOrder: () => void;
}



export function Cart({cartItems, handleRemoveCartItem, handleSchedule, schedule, handleCancelOrder}: CartProps){
  const {totalTime, totalPrice} = cartItems.reduce((acc, item) => {
    if(!item.item.time && item.quantity){
      return {
        totalTime: acc.totalTime,
        totalPrice: acc.totalPrice + item.quantity * item.item.price,
      };
    }else if(item.item.time){
      return {
        totalTime: acc.totalTime + item.item.time,
        totalPrice: acc.totalPrice + item.item.price,
      };
    }

    return {totalTime: acc.totalTime, totalPrice: acc.totalPrice};
  }, {totalTime: 0, totalPrice:0});

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
                {service.item.imageUrl && <Image source={{ uri: service.item.imageUrl}}/>}

                <QuantityCoitaner>
                  <Text size={14} color='#666'>{service.quantity ? service.quantity : 1}x</Text>
                </QuantityCoitaner>

                <InfoContainer>
                  <Text weight='600' size={14}>{service.item.name}</Text>
                  <Info>
                    {service.item.time && (
                      <>
                        <Text size={14} color='#666'>{service.item.time} min</Text>
                        <Text size={14} color='#666'>|</Text>
                      </>
                    )}
                    <Text size={14} color='#666'>{formatCurrency(service.item.price)}</Text>
                  </Info>
                </InfoContainer>
              </ServiceInfo>

              {handleRemoveCartItem && (
                <Actions
                  onPress={() => handleRemoveCartItem(service)}
                >
                  <AntDesign name="minuscircleo" size={20} color="#43c6ac" />
                </Actions>
              )}
            </Item>
          )}
        />
      )}
      <Summary>

        <SummaryInfo>
          {cartItems.length == 0 ?
            <Text color='#fff'>Nenhum servico selecionado</Text>
            :
            (
              <>
                <Text style={{marginTop: 8}} color='#fff'>Tempo</Text>
                <Text weight='600' color='#fff'>{formatTime(totalTime)}</Text>
                <Text style={{marginTop: 8}} color='#fff'>Total</Text>
                <Text weight='600' color='#fff'>{formatCurrency(totalPrice)}</Text>
              </>

            )
          }
        </SummaryInfo>
        {schedule ? (
          <SecondaryButton onPress={handleCancelOrder}>
            Cancelar Pedido
          </SecondaryButton>
        ) : (
          <Button
            disabled={cartItems.length === 0}
            onPress={handleSchedule}
          >
            Agendar Horario
          </Button>
        )}
      </Summary>
    </>
  );
}

//navigate('Schedule', {price: totalPrice, time: totalTime, cartItems})
