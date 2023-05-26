
import { Text } from '../../../components/Text';
import { Container, Header, Body, Footer, FooterContainer, CancelOrder, SelectDay, SelectDayContainer, SelectHourContainer, SelectHour, ButtonContainer, ScheduleContainer, CenteredContainer, UserContainer, BackButton, Spacer, Menu, ServiceMenuItem, ProductMenuItem } from './styles';
import { Service } from '../../../types/service';
import { useEffect, useState } from 'react';
import { CartItem } from '../../../types/CartItem';
import { Cart } from '../../../components/cart';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { ActivityIndicator } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { ScheduleModal } from '../../../components/schedule-modal';
import { Button } from '../../../components/button';
import { AvaliableHoursInterface, SelectHourModal } from '../../../components/select-hour-modal';
import { useAuth } from '../../../context/auth-context';
import { ServiceList } from '../../../components/services-list';
import { getDateWithSelectedDay, getYearMontSring } from '../../../utils/date';
import { discountHour, getQuarterHourIntervals } from '../../../utils/hours';
import { Link } from '@react-navigation/native';
import { ConfirmModal } from '../../../components/confirm-modal';


//TODO: give good names to this shit clean code is crying
//TODO: i think i dont need the hour and minute stat that could be one object state
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
  const [isLoading ,setIsLoading] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<string>('');
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);

  function handleAddToCart(service: Service){
    if(cartItems.find(({item}) => item.id === service.id)) return;

    const item: CartItem = {item: service};
    setCartItems(items => [...items, item]);
    return;
  }

  function handleRemoveCartItem(item: CartItem){
    const newItems = cartItems.filter(cartItem => cartItem.item !== item.item);
    //if the gay empty the cartItems the order is canceled
    if(newItems.length == 0){
      handleCancelOrder();
    }
    setCartItems(newItems);
  }

  function handleSchedule(){
    setSchedule(true);
  }

  function handleCancelOrder(){
    setCartItems([]);
    setSchedule(false);
    setTimeError('');
    setMinutes('');
    setHour('');
    setDay(null);
  }

  function handleOpenCalendarModal(){
    setCalendarModalVisibility(true);
  }

  function handleCloseCalendarModal(){
    setCalendarModalVisibility(false);
  }

  //were the day is selected i create a new document with the yyyy-month-day
  //in firebase and store the hours range defined by the adm in pages/admin/home/index
  async function handleSelectDay(day: number){
    const documentId = getDateWithSelectedDay(day);
    const docRef = doc(FIREBASE_DB, 'DiaHora', documentId);
    try{
      const dataSnap = await getDoc(docRef);
      if(dataSnap.exists()){
        setDay(day);
        return;
      }else{

        const yearMonth = getYearMontSring();
        const dockRefAtnd = doc(FIREBASE_DB, 'Atendimento', yearMonth);
        const dataSnap = await getDoc(dockRefAtnd);
        const data = dataSnap.data();
        const morningHours = data?.morningHour;
        const afternoonHours = data?.afternoonHour;

        const strMorning = `${morningHours.from.hour}:${morningHours.from.minutes} - ${morningHours.to.hour}:${morningHours.to.minutes}`;

        const strAfternoon = `${afternoonHours.from.hour}:${afternoonHours.from.minutes} - ${afternoonHours.to.hour}:${afternoonHours.to.minutes}`;

        const morning = getQuarterHourIntervals(strMorning);
        const afternoon = getQuarterHourIntervals(strAfternoon);

        const hrs = [...morning, ...afternoon];

        await setDoc(docRef, {
          horas: hrs,
        });
        setDay(day);
      }

    }catch(error){
      throw new Error('error');
    }

  }

  function handleCloseHourModal(){
    setSelectHourModalVisibility(false);
  }

  function handleSetTime({hour, min}: AvaliableHoursInterface){
    setHour(hour);
    setMinutes(min);
  }

  async function handleAddHorario(){
    setScheduleLoading(true);
    setTimeError('');
    if(!day || !hour || !minutes || cartItems.length == 0){
      return;
    }


    const {totalTime, totalPrice} = cartItems.reduce((acc, item) => {
      return {
        totalTime: acc.totalTime + item.item.time,
        totalPrice: acc.totalPrice + item.item.price,
      };
    }, {totalTime: 0, totalPrice:0});

    //get the available hours and verify if the selected time is available
    const documentId = getDateWithSelectedDay(day);
    const hoursDatabaseRef = doc(FIREBASE_DB, 'DiaHora', documentId);
    let updatedHours: string [] = [];
    try{
      const dataSnap = await getDoc(hoursDatabaseRef);

      const data = dataSnap.data();
      const newHours = discountHour(data?.horas, totalTime, `${hour}:${minutes}`);

      if(newHours === -1 || typeof newHours === 'number'){
        setTimeError('Horario nao disponivel');
        setScheduleLoading(false);
        return;
      }else{
        updatedHours = [...newHours];
      }

    }catch(error){
      setScheduleLoading(false);
      throw new Error();
    }

    //make the new schedule
    const newDate = new Date(Date.now());
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const date = new Date(year, month, day,  parseInt(hour), parseInt(minutes));

    const schedule = {
      services: cartItems.map(item => item.item),
      time: totalTime,
      price: totalPrice,
      date: date,
      userId: user?.id,
    };

    try{
      //TODO: make a transaction to handle the 2 things
      await addDoc(collection(FIREBASE_DB, 'Agendamento'), schedule);
      await setDoc(hoursDatabaseRef, {horas: updatedHours});

      setConfirmModalVisible(true);
      setCartItems([]);
      setDay(null);
      setHour('');
      setMinutes('');
      setSchedule(false);
      setScheduleLoading(false);
    }
    catch(error){
      setCartItems([]);
      setDay(null);
      setHour('');
      setMinutes('');
      setSchedule(false);
      setScheduleLoading(false);
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
              {cartItems.length == 0 ? (
                <BackButton>
                  <Link to={{screen: 'User'}}>
                    <Text weight='700' size={24} color='#666'><AntDesign name="arrowleft" size={24} color="black" /></Text>

                  </Link>
                </BackButton>

              ) : <Spacer/>}
              {cartItems.length > 0 ? (
                <CancelOrder onPress={handleCancelOrder}>
                  <Text color='red'>Cancelar pedido</Text>
                </CancelOrder>
              ) : (
                <UserContainer>
                  <Link to={{screen: 'User'}}>
                    <Text size={16}>{user?.email} <EvilIcons name="user" size={24} color="black" /></Text>
                  </Link>
                </UserContainer>
              )}
            </>
          )}
        </Header>
        <Body>
          {!schedule && (
            <Menu>
              <ServiceMenuItem>
                <Text color='#fff'>Servicos</Text>
              </ServiceMenuItem>
              <ProductMenuItem>
                <Text color='#fff'>Produtos</Text>
              </ProductMenuItem>
            </Menu>
          )}
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
                  disabled={!day}
                  onPress={() => setSelectHourModalVisibility(true)}
                >
                  <Text>Selecione um Horario</Text>
                  <AntDesign name="hourglass" size={24} color="black" />
                </SelectHour>
                {hour || minutes ? (
                  <Text>{hour} : {minutes}</Text>
                ) : ( <Text>Nenhum horario selecionado</Text>)}
                {timeError && (<Text color='red'>Horario indisponivel</Text>)}
              </SelectHourContainer>
              <ButtonContainer>
                <Button
                  disabled={day == null || hour == '00' || scheduleLoading}
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
        setTime={handleSetTime}
        day={day}
      />
      <ConfirmModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
      />
    </>
  );
}
