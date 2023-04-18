
import { CalendarContainer, Check, CheckBoxContainer, Container, HorarioBox, HorarioContainer, HoraStart, OptionsContaier, SendConfigurations } from './styles';
import { Text } from '../../../components/Text';
import CustomCalendar from '../../../components/CustomCalendar';
import { useEffect, useState } from 'react';
import {AntDesign} from '@expo/vector-icons';
import type { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { formatStringDate, getYearMontSring } from '../../../utils/date';

export function Home(){
  const [notWorkAtWeekends, setNotWorkAtWeekend] = useState(false);
  const [selected, setSelected] = useState<MarkedDates>({});

  useEffect(()=> {
    const mes = getYearMontSring();
    const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
    const getData = async () => {
      const dataSnap = await getDoc(dockRef);
      const dates = dataSnap.data();
      const mark = {} as MarkedDates;
      dates?.days.map((day: string) => (
        mark[day] = {selected: true, selectedColor: 'red'}
      ));

      setSelected(mark);
    };

    getData();
  }, []);

  function handelDisableWeekend(){
    const mark = {} as MarkedDates;

    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth() +1;
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let maxDays = days[month];
    if(month == 1){ //febrary
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    for(let i =1; i <= maxDays; i++){
      const date = new Date(`${year}-${month}-${i}`);
      const dateString = `${year}-${month}-${i}`;
      if(date.getDay() == 5 || date.getDay() == 6){
        mark[formatStringDate(dateString)] = { selectedColor: 'red', selected: true};
      }
    }
    setSelected({...selected, ...mark});
  }

  function handleEnableWeekend(){
    const mark = {} as MarkedDates;

    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth() +1;
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let maxDays = days[month];
    if(month == 1){ //febrary
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    for(let i =1; i <= maxDays; i++){
      const date = new Date(`${year}-${month}-${i}`);
      const dateString = `${year}-${month}-${i}`;
      if(date.getDay() == 5 || date.getDay() == 6){
        mark[formatStringDate(dateString)] = { selectedColor: '', selected: false};
      }
    }
    setSelected({...selected, ...mark});
  }

  function handleSelectNotWorkAtWeekends(){
    if(notWorkAtWeekends){
      setNotWorkAtWeekend(false);
      handleEnableWeekend();
      return;
    }
    setNotWorkAtWeekend(true);
    handelDisableWeekend();
  }

  function handleSelectDay(date: DateData){
    const currentDate = date.dateString;
    const selectedCopy =  selected;

    const mark = {} as MarkedDates;

    if(selectedCopy[currentDate]){
      if(selectedCopy[currentDate].selected){
        selectedCopy[currentDate] = {selected: false, selectedColor: ''};
      }else{
        mark[currentDate] = {selected: true, selectedColor: 'red'};
      }
    }else{
      mark[currentDate] = {selected: true, selectedColor: 'red'};
    }
    setSelected({...selected, ...mark});
  }

  async function sendDaysToWork(){
    const days = [];
    for (const [key, value] of Object.entries(selected)){
      if(value.selected){
        days.push(key);
      }
    }
    const dateId = getYearMontSring();
    await setDoc(doc(FIREBASE_DB, 'Atendimento', dateId), {
      days
    });
  }

  return (
    <Container>
      <CalendarContainer>
        <Text weight='600' size={16} style={{alignSelf: 'center'}}>Selecione os dias que ira atender</Text>
        <CustomCalendar selected={selected} handleSelectDay={handleSelectDay}/>
      </CalendarContainer>

      <OptionsContaier>
        <CheckBoxContainer
          onPress={handleSelectNotWorkAtWeekends}
        >
          <Text size={20}>Nao atender fins de semana</Text>
          <Check>
            {notWorkAtWeekends ? <AntDesign name="check" size={24} color="green" /> : null }
          </Check>
        </CheckBoxContainer>
        <SendConfigurations
          onPress={sendDaysToWork}
        >
          <Text size={20} color='#fff'>Salvar configuraçoes</Text>
        </SendConfigurations>
      </OptionsContaier>
    </Container>
  );
}


// <HorarioContainer>
// <Text>Horario de atendimento</Text>
// <HorarioBox>
//   <Text weight='600'>Hora Inicio</Text>
//   <HoraStart

//   />
// </HorarioBox>
// <HorarioBox>
//   <Text weight='600'>Hora fim</Text>
//   <HoraStart
//   />
// </HorarioBox>
// </HorarioContainer>
