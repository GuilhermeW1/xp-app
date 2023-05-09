import { FlatList } from 'react-native';
import { Service } from '../../types/service';
import { Text } from '../Text';
import { AddToCartButton, InfoContainer, ServiceContainer } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';

interface ServiceListProps {
  services: Service[];
  addToCart: (service: Service) => void;
}

export function ServiceList({services, addToCart}: ServiceListProps){
  return(
    <FlatList
      data={services}
      keyExtractor={item => item.id}
      renderItem={({item: service}) => (
        <ServiceContainer>
          <Text size={20} weight='600'>{service.name}</Text>
          <InfoContainer>
            <Text>{service.time} min</Text>
            <Text>{formatCurrency(service.price)}</Text>
          </InfoContainer>
          <AddToCartButton
            onPress={() => addToCart(service)}
          >
            <AntDesign name="pluscircleo" size={24} color="red" />
          </AddToCartButton>
        </ServiceContainer>
      )}
    />
  );
}
