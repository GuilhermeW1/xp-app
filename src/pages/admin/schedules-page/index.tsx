import React, { useEffect, useState } from 'react';
import { Text } from '../../../components/Text';
// import { useAuth } from '../../../context/auth-context';
import { CenteredContainer, Container, InfoContainer, ItemContainer, MenuContainer, OptionButton, ScheduleItem, Separetor, ServicesList, TimeContainer } from './styles';
import CustomCalendar from '../../../components/CustomCalendar';
import {  collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { ScheduleInterface } from '../../../types/Schedule';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { getFirebaseDateAndHour } from '../../../utils/getFirebaseDateAndHour';
import { formatTime } from '../../../utils/formatTime';
import { formatCurrency } from '../../../utils/formatCurrency';
import { generateRandomId } from '../../../utils/randomId';
import { MarkedDates } from 'react-native-calendars/src/types';

interface ScheduleWithId extends ScheduleInterface { id: string }
//NOTE: i think i can use a useReducer
export function SchedulesPage(){
  // const {signOut} = useAuth();

  const [schedules, setSchedules] = useState<ScheduleWithId[] | null>([]);
  const [timestamp, setTimestamp] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<MarkedDates>({});

  function handleDay(date: string, time: number){
    if(timestamp  === time){
      return;
    }

    setTimestamp(time);
    const mark = {} as MarkedDates;
    mark[date] = {selected: true, selectedColor: 'red'};
    setSelected(mark);
  }

  useEffect(() => {
    setIsLoading(true);
    const dbSchedules: ScheduleWithId[] = [];

    let dbQuery;

    if(timestamp === 1){
      dbQuery = query(collection(FIREBASE_DB, 'Agendamento'), where('date', '>=', new Date()), orderBy('date'));
    }else if(timestamp === 2){
      dbQuery = query(collection(FIREBASE_DB, 'Agendamento'), orderBy('date'));
    } else {
      const newDate = new Date(timestamp);
      //TODO: isso aqui pode estorar uma hr :P
      //for one reason that i dont know why i have to add one day to search the right day
      //in firebase the date is stored in utc-3
      const horarioInicial = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()+1, 0, 0, 0);
      const horarioFinal = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 2, 0, 0, 0);
      dbQuery = query(collection(FIREBASE_DB, 'Agendamento'),
        where('date', '>=', horarioInicial), where('date', '<=', horarioFinal), orderBy('date'));

    }

    const unsubscribe = onSnapshot(dbQuery, (snapshot) => {
      if(snapshot.empty){
        setSchedules(null);
        setIsLoading(false);
        return;
      }

      // snapshot.docChanges().forEach(change => {
      //   const doc = change.doc;
      //   const data = doc.data();
      //   const schedule: ScheduleWithId = {
      //     id: doc.id,
      //     date: data.date,
      //     price: data.price,
      //     time: data.time,
      //     userId: data.userId,
      //     services: data.services
      //   };

      //   if(change.type === 'added'){
      //     setSchedules(prev => {
      //       if(!prev) return null;

      //       if(!prev.some(item => item.id === schedule.id)){
      //         return [...prev, schedule];
      //       }
      //       return prev;
      //     });
      //     return;
      //   }
      //   if(change.type === 'modified'){
      //     setSchedules(prev => {
      //       if(!prev) return null;

      //       return prev?.map(item => item.id === schedule.id ? schedule : item);
      //     });
      //     return;
      //   }
      //   if(change.type === 'removed'){
      //     setSchedules(prev => {
      //       if(!prev) return null;

      //       return prev?.filter(item => item.id !== schedule.id);
      //     });
      //     return;
      //   }
      //   console.log('aa');
      // });

      snapshot.forEach((doc) => {
        const data = doc.data();
        const schedule: ScheduleWithId = {
          id: generateRandomId(8),
          date: data.date,
          price: data.price,
          time: data.time,
          userId: data.userId,
          services: data.services
        };

        dbSchedules.push(schedule);
      });


      setSchedules(dbSchedules);
      setIsLoading(false);
    }, (error) => {console.log(error); setIsLoading(false);});

    return () => unsubscribe();


  }, [timestamp]);

  return (
    <Container>
      {/* <LogoutButton
        onPress={signOut}
      >
        <Text>Sign Out</Text>
      </LogoutButton> */}

      <CustomCalendar
        selected={selected}
        handleSelectDay={({timestamp, dateString}) => handleDay(dateString,timestamp)}
      />
      <MenuContainer>

        <OptionButton onPress={() => {setTimestamp(1); setSelected({});}}>
          <Text size={14}>Pendentes</Text>
        </OptionButton>
        {/* <OptionButton>
          <Text size={14}>Agendamentos</Text>
        </OptionButton> */}
        <OptionButton onPress={() => {setTimestamp(2); setSelected({});}}>
          <Text size={14} >Historico</Text>
        </OptionButton>
      </MenuContainer>
      {isLoading ? (
        <CenteredContainer>
          <ActivityIndicator size='large'/>
        </CenteredContainer>
      ) : (
        schedules ? (
          <FlatList
            keyExtractor={(item) => item.id}
            data={schedules}
            style={{marginTop: 24}}
            ItemSeparatorComponent={Separetor}
            renderItem={({item: schedule}) => {
              const {formatedDate, hour, minutes} = getFirebaseDateAndHour(schedule.date.seconds);
              return(
                <ScheduleItem>
                  <ServicesList>
                    {schedule.services.map((doc, index) => {
                      return(
                        <Text key={index} weight='600' color='#666'>{doc.name}</Text>
                      );})}
                  </ServicesList>
                  <ItemContainer>
                    <TimeContainer>
                      <Text size={14}>{`${hour}:${minutes}`}</Text>
                      <Text size={14}>{formatedDate}</Text>
                    </TimeContainer>
                    <InfoContainer>
                      <Text size={14}>{formatTime(schedule.time)}</Text>
                      <Text size={14} style={{marginBottom: 20}}>{formatCurrency(schedule.price)}</Text>
                    </InfoContainer>
                  </ItemContainer>
                </ScheduleItem>
              );
            }}
          />
        ) : (
          <CenteredContainer>
            <Text size={24}>Nenhum agendamento</Text>
            <Text size={24}>encontrado</Text>
          </CenteredContainer>
        )
      )}
    </Container>
  );
}
