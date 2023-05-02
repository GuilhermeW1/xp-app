
import { Text } from '../../../components/Text';
import { Container, Header, Body, ServiceContainer, Footer, FooterContainer, InfoContainer, AddToCartButton, CancelOrder } from './styles';
import { Service } from '../../../types/service';
import { useEffect, useState } from 'react';
import { CartItem } from '../../../types/CartItem';
import { Cart } from '../../../components/cart';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { FlatList } from 'react-native';
import { formatCurrency } from '../../../utils/formatCurrency';
import {AntDesign} from '@expo/vector-icons';
import { ScheduleModal } from '../../../components/schedule-modal';
import { useNavigation } from '@react-navigation/native';

export default function HomeUser(){
  const [services, setServices] = useState<Service[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigation = useNavigation();

  function handleAddToCart(service: Service){
    if(cartItems.find(({item}) => item.id === service.id)) return;

    const item: CartItem = {item: service};
    setCartItems(items => [...items, item]);
    return;
  }

  function handleRemoveCartItem(item: CartItem){
    const newItems = cartItems.filter(cartItem => cartItem.item !== item.item);
    setCartItems(newItems);
  }

  useEffect(() => {
    const getServices = async() => {
      const dbService: Service[] = [];
      try{
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const service = {
            id: doc.id,
            name: data.nome,
            price: data.valor,
            time: data.tempo
          };
          dbService.push(service);
        });
      }catch(error){
        throw new Error();
      }
      setServices(dbService);
    };
    getServices();
  },[]);

  return(
    <>
      <Container>
        <Header>
          <Text weight='700' size={24} color='#666'>Bem Vindo</Text>
          {cartItems.length > 0 && (
            <CancelOrder onPress={() => setCartItems([])}>
              <Text color='red'>Cancelar pedido</Text>
            </CancelOrder>
          )}
        </Header>
        <Body>
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
                  onPress={() => handleAddToCart(service)}
                >
                  <AntDesign name="pluscircleo" size={24} color="red" />
                </AddToCartButton>
              </ServiceContainer>
            )}
          />
        </Body>
      </Container>
      <Footer>
        <FooterContainer>
          <Cart cartItems={cartItems} handleRemoveCartItem={handleRemoveCartItem}/>
        </FooterContainer>
      </Footer>
    </>
  );
}


// const [selected, setSelected] = useState<MarkedDates>({} as MarkedDates);

//   useEffect(()=> {
//     const mes = getYearMontSring();
//     console.log(mes);
//     const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
//     const getData = async () => {
//       const dataSnap = await getDoc(dockRef);
//       const dates = dataSnap.data();
//       const mark = {} as MarkedDates;
//       dates?.days.map((day: string) => (
//         mark[day] = {selected: true, selectedColor: 'red', disabled: true}
//       ));
//       setSelected(mark);
//     };

//     getData();
//   }, []);



//   function getToday(){
//     const today = new Date(Date.now());
//     const [date] = today.toISOString().split('T');
//     return date;
//   }

//   return(
//     <Calendar
//       markedDates={selected}
//       onDayPress={({day}) => alert(day)}
//       disableArrowLeft
//       minDate={getToday()}
//       disableAllTouchEventsForDisabledDays
//     />
//   );
