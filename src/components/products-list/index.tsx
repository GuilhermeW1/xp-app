import { FlatList } from 'react-native';
import { Text } from '../Text';
import { AddToCartButton, Image, InfoContainer, Separetor, ServiceContainer } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';
import { UserProduct } from '../../types/Product';

interface ServiceListProps {
  products: UserProduct[];
  addToCart: (product: UserProduct) => void;
}

export function ProductList({products, addToCart}: ServiceListProps){
  return(
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={Separetor}
      renderItem={({item: product}) => (
        <ServiceContainer>
          {product.imageUrl ?  <Image source={{ uri: product.imageUrl }}/> : null}
          <InfoContainer>
            <Text size={20} weight='600'>{product.name}</Text>
            <Text>{product.description} min</Text>
            <Text>{formatCurrency(product.price)}</Text>
          </InfoContainer>
          <AddToCartButton
            onPress={() => addToCart(product)}
          >
            <AntDesign name="pluscircleo" size={24} color="#43c6ac" />
          </AddToCartButton>
        </ServiceContainer>
      )}
    />
  );
}
