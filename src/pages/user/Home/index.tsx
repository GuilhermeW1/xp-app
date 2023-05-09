
import { Text } from '../../../components/Text';
import { Container, Header, Body, Footer, FooterContainer, CancelOrder, SelectDay, SelectDayContainer, SelectHourContainer, SelectHour, ButtonContainer, ScheduleContainer, CenteredContainer } from './styles';
import { Service } from '../../../types/service';
import { useEffect, useState } from 'react';
import { CartItem } from '../../../types/CartItem';
import { Cart } from '../../../components/cart';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { ActivityIndicator } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import { ScheduleModal } from '../../../components/schedule-modal';
import { Button } from '../../../components/button';
import { SelectHourModal } from '../../../components/select-hour-modal';
import { useAuth } from '../../../context/auth-context';
import { ServiceList } from '../../../components/services-list';

export default function HomeUser(){
  const {user} = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [schedule, setSchedule] = useState<boolean>(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState<boolean>(false);
  const [selectHourModalVisibility, setSelectHourModalVisibility] = useState<boolean>(false);
  const [day, setDay] = useState<number | null>(null);
  const [hour, setHour] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [isLoading ,setIsLoading] = useState(false);

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

  function handleSchedule(){
    setSchedule(true);
  }

  function handleCancelOrder(){
    setCartItems([]);
    setSchedule(false);
  }

  function handleOpenCalendarModal(){
    setCalendarModalVisibility(true);
  }

  function handleCloseCalendarModal(){
    setCalendarModalVisibility(false);
  }

  function handleSelectDay(day: number){
    setDay(day);
  }

  function handleCloseHourModal(){
    setSelectHourModalVisibility(false);
  }

  function handleSetMinutes(min: string){
    setMinutes(min);
  }

  function handleSetHours(hr: string){
    setHour(hr);
  }


  async function handleAddHorario(){
    if(!day || !hour || !minutes || cartItems.length == 0){
      return;
    }
    const newDate = new Date(Date.now());
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const date = new Date(year, month, day,  parseInt(hour), parseInt(minutes));
    const {totalTime, totalPrice} = cartItems.reduce((acc, item) => {
      return {
        totalTime: acc.totalTime + item.item.time,
        totalPrice: acc.totalPrice + item.item.price,
      };
    }, {totalTime: 0, totalPrice:0});

    const schedule = {
      services: cartItems.map(item => item.item.id),
      time: totalTime,
      price: totalPrice,
      date: date,
      userId: user?.id,
    };

    try{
      await addDoc(collection(FIREBASE_DB, 'Agendamento'), schedule);
      setCartItems([]);
      setDay(null);
      setHour('');
      setMinutes('');
      setSchedule(false);
    }
    catch(error){
      setCartItems([]);
      setDay(null);
      setHour('');
      setMinutes('');
      setSchedule(false);
      throw new Error();
    }

  }

  const getServices = async() => {
    setIsLoading(true);
    const dbService: Service[] = [];
    try{
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));
      if(!querySnapshot){
        return;
      }
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
    setIsLoading(false);
  };



  useEffect(() => {
    getServices();
  },[]);

  return(
    <>
      <Container>
        <Header>
          {schedule ? (
            <Text size={24} weight='600' color='#666'>Confirme e agende seu horario</Text>
          ) : (
            <>
              <Text weight='700' size={24} color='#666'>Bem Vindo</Text>
              {cartItems.length > 0 && (
                <CancelOrder onPress={handleCancelOrder}>
                  <Text color='red'>Cancelar pedido</Text>
                </CancelOrder>
              )}
            </>
          )}
        </Header>
        <Body>
          {schedule ? (
            <ScheduleContainer>
              <SelectDayContainer>
                <SelectDay
                  onPress={handleOpenCalendarModal}
                >
                  <Text size={16}>Escolher Dia </Text>
                  <AntDesign name="calendar" size={24} color="black" />
                </SelectDay>
                {day ? (<Text style={{marginLeft: 20}}>Dia {day}</Text>) : <Text style={{marginLeft: 20}}>Nenhum dia Selecionado</Text>}
              </SelectDayContainer>
              <SelectHourContainer>
                <SelectHour
                  onPress={() => setSelectHourModalVisibility(true)}
                >
                  <Text>Selecione um Horario</Text>
                  <AntDesign name="hourglass" size={24} color="black" />
                </SelectHour>
                {hour || minutes ? (
                  <Text>{hour} : {minutes}</Text>
                ) : ( <Text>Nenhum horario selecionado</Text>)}
              </SelectHourContainer>
              <ButtonContainer>
                <Button
                  disabled={day == null || hour == '00'}
                  onPress={handleAddHorario}>
                Agendar Horario
                </Button>
              </ButtonContainer>
            </ScheduleContainer>
          ) :
          //render activity indicator
            isLoading ? (
              <CenteredContainer>
                <ActivityIndicator color='#FF6000' size='large'/>
              </CenteredContainer>
            )
              : (
                <ServiceList services={services} addToCart={handleAddToCart}/>
              )}
        </Body>
      </Container>
      <Footer>
        <FooterContainer>
          <Cart
            cartItems={cartItems}
            handleRemoveCartItem={handleRemoveCartItem}
            handleSchedule={handleSchedule}
            schedule={schedule}
            handleCancelOrder={handleCancelOrder}
          />
        </FooterContainer>
      </Footer>
      <ScheduleModal
        visible={calendarModalVisibility}
        onClose={handleCloseCalendarModal}
        handleSelectDay={handleSelectDay}
      />
      <SelectHourModal
        visible={selectHourModalVisibility}
        onClose={handleCloseHourModal}
        setMinutesModal={handleSetMinutes}
        setHoursModal={handleSetHours}
      />
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
