import { FlatList } from 'react-native';
import { UserService } from '../../types/service';
import { Text } from '../Text';
import { AddToCartButton, Image, InfoContainer, Separetor, ServiceContainer } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';

interface ServiceListProps {
  services: UserService[];
  addToCart: (service: UserService) => void;
}

export function ServiceList({services, addToCart}: ServiceListProps){
  return(
    <FlatList
      data={services}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={Separetor}
      renderItem={({item: service}) => (
        <ServiceContainer>
          {service.imageUrl ?  <Image source={{ uri: service.imageUrl }}/> : null}
          <InfoContainer>
            <Text size={20} weight='600'>{service.name}</Text>
            <Text>{service.time} min</Text>
            <Text>{formatCurrency(service.price)}</Text>
          </InfoContainer>
          <AddToCartButton
            onPress={() => addToCart(service)}
          >
            <AntDesign name="pluscircleo" size={24} color="#43c6ac" />
          </AddToCartButton>
        </ServiceContainer>
      )}
    />
  );
}
