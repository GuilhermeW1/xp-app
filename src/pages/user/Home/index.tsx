
import { Text } from '../../../components/Text';
import { Container, Header, Body, Footer, FooterContainer, CancelOrder, SelectDay, SelectDayContainer, SelectHourContainer, SelectHour, ButtonContainer, ScheduleContainer, CenteredContainer, UserContainer, BackButton, Spacer, Menu, MenuItem } from './styles';
import { UserService } from '../../../types/service';
import { useEffect, useState } from 'react';
import { CartItem } from '../../../types/CartItem';
import { Cart } from '../../../components/cart';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../../firebaseConfig';
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
import { getDownloadURL, ref } from 'firebase/storage';
import { UserProduct } from '../../../types/Product';
import { ProductList } from '../../../components/products-list';

//
//NOTE: the app is based on cartItems where service have a defined time and product dont have
// thats the way tath i could think to solve the problem quickly
//

//TODO: give good names to this shit clean code is crying
//TODO: i think i dont need the hour and minute stat that could be one object state
export default function HomeUser(){
  const {user} = useAuth();

  const [services, setServices] = useState<UserService[]>([]);
  const [products, setProducts] = useState<UserProduct[]>([]);
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
  const [selectedMenuItem, setSelectedMenuItem] = useState(1);

  function handleAddToCart(service: UserService | UserProduct){
    return setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.item.id === service.id);

      if(itemIndex < 0){
        return prevState.concat({
          quantity: 1,
          item: service,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      if(item.quantity && !service.time){
        newCartItems[itemIndex] = {
          ...newCartItems[itemIndex],
          quantity: item.quantity +1
        };

        return newCartItems;
      }

      return prevState;
    });
  }
  function handleRemoveCartItem(item: CartItem){
    const itemIndex = cartItems.findIndex(cartItem => cartItem.item.id == item.item.id);

    if(itemIndex < 0){
      handleCancelOrder();
      return setCartItems([]);
    }

    const newItems = [...cartItems];
    const selectedItem = newItems[itemIndex];

    if(!selectedItem.item.time){
      if(selectedItem.quantity === 1){
        return setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== item.item.id));
      }

      if(selectedItem.quantity){
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity: selectedItem.quantity -1,
        };

        return setCartItems(newItems);
      }
    }
    return setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== item.item.id));
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

  //NOTE: essa funcao ta muito grande
  async function handleAddHorario(){
    setScheduleLoading(true);
    setTimeError('');
    if(!day || !hour || !minutes || cartItems.length == 0){
      return;
    }


    const {totalTime, totalPrice} = cartItems.reduce((acc, item) => {
      if(!item.item.time){
        return {
          totalTime: acc.totalTime,
          totalPrice: acc.totalPrice + item.item.price,
        };
      }
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
  async function loadServices(){
    try{
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));
      if(querySnapshot.empty){
        setServices([]);
        setIsLoading(false);
        return;
      }
      const servicesPromises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imagePath = data.imagePath ?? null;
        let url;
        if(imagePath){
          const imageRef = ref(FIREBASE_STORAGE, imagePath);
          try{
            url = await getDownloadURL(imageRef);
          }catch(error){
            console.log(error);
            throw new Error('erro ao buscar imagePath do servico');
          }
        }
        const userService: UserService =
          {
            id: doc.id,
            name: data.nome,
            price: data.valor,
            time : data.tempo,
            imageUrl: url ?? null
          };
        return userService;
      });
      const services = await Promise.all(servicesPromises);
      setServices(services);
      setIsLoading(false);
    }catch(error){
      setIsLoading(false);
      throw new Error('erro ao buscar servicos');
    }
  }

  async function loadProducts(){
    setIsLoading(true);
    try{
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Produtos'));
      if(querySnapshot.empty){
        setIsLoading(false);
        setProducts([]);
        return;
      }

      const servicesPromises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imagePath = data.imagePath ?? null;
        let url;
        if(imagePath){
          const imageRef = ref(FIREBASE_STORAGE, imagePath);
          try{
            url = await getDownloadURL(imageRef);
          }catch(error){
            setProducts([]);
            console.log(error);
            throw new Error('erro ao buscar imagePath do produtos');
          }
        }
        const userService: UserProduct =
          {
            id: doc.id,
            name: data.nome,
            price: data.valor,
            description : data.descricao,
            imageUrl: url ?? ''
          };
        return userService;
      });
      const products = await Promise.all(servicesPromises);
      setProducts(products);
      setIsLoading(false);
    }catch(error){
      setIsLoading(false);
      throw new Error('erro ao buscar servicos');
    }
  }
  useEffect(() => {
    (async() => {
      if(selectedMenuItem === 1){
        await loadServices();
      }else{
        await loadProducts();
      }

    })();
  },[selectedMenuItem]);

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
              <MenuItem
                style={selectedMenuItem == 1 ? {backgroundColor: '#43c6ac'} : {opacity: 0.5}}
                onPress={() => setSelectedMenuItem(1)}
              >
                <Text color='#fff'>Servicos</Text>
              </MenuItem >
              <MenuItem
                style={selectedMenuItem == 2 ? {backgroundColor: '#43c6ac'} : {opacity: 0.5}}
                onPress={() => setSelectedMenuItem(2)}
              >
                <Text color='#fff'>Produtos</Text>
              </MenuItem>
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
                  disabled={day == null || hour == '00' || !hour || scheduleLoading}
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
              : selectedMenuItem == 1 ? services.length > 0 ?
                <ServiceList services={services} addToCart={handleAddToCart}/>
                :(<CenteredContainer>
                  <Text>Nenhum serviço encontrado</Text>
                </CenteredContainer>)
                : products.length > 0 ?
                  <ProductList products={products} addToCart={handleAddToCart}/>
                  :(<CenteredContainer>
                    <Text>Nenhum produto encontrado</Text>
                  </CenteredContainer>)
          }
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
