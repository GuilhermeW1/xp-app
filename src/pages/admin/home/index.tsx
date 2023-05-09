import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { Text } from '../../../components/Text';
import CustomCalendar from '../../../components/CustomCalendar';

import type { DateData, MarkedDates } from 'react-native-calendars/src/types';

import {
  AfternoonContainer,
  CalendarContainer,
  CenteredContainer,
  Check,
  CheckBoxContainer,
  Container,
  MorningContainer,
  OptionsContaier,
  SendConfigurations,
  ServiceContainer,
  ServiceHourSelection } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { formatStringDate, getYearMontSring } from '../../../utils/date';
import { Button } from '../../../components/button';
import { RangeModal } from '../../../components/range-hour-modal';


export interface HourInterface {
  from: {
    hour: string;
    minutes: string;
  },
  to: {
    hour: string;
    minutes: string;
  }

}
//TODO: create some ref to recive te first input and compare the values of the stataes then disable the button if there is no change
// and enable the button if is some change
export function Home(){
  const init = {from: {hour: '00', minutes: '00'}, to: {hour: '00', minutes: '00'}};
  const [notWorkAtWeekends, setNotWorkAtWeekend] = useState(false);
  const [selected, setSelected] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [morningHour, setMorningHour] = useState<HourInterface>(init);
  const [afternoonHour, setAfternoonHour] = useState<HourInterface>(init);
  const [rangeModalVisibility, setRangeModalVisibility] = useState<boolean>(false);
  const [rangeModalData, setRangeModalData] = useState('');
  const [error, setError] = useState('');



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

  //melhorar esse nome
  async function sendDaysToWork(){
    if(morningHour.from.hour === '00' || afternoonHour.from.hour === '00' ||
      morningHour.to.hour === '00' || afternoonHour.to.hour === '00'){
      setError('Horario nao selecionado');
      return;
    }
    const days = [];
    for (const [key, value] of Object.entries(selected)){
      if(value.selected){
        days.push(key);
      }
    }
    const dateId = getYearMontSring();
    await setDoc(doc(FIREBASE_DB, 'Atendimento', dateId), {
      morningHour,
      afternoonHour,
      days
    });
  }

  //it should be morning or afternoon/night but i cant found a good name to it
  function handleSelectHour(dayStatus: string){
    if(dayStatus == 'morning'){
      setRangeModalData('morning');
      setRangeModalVisibility(true);
    }
    if(dayStatus === 'afternoon'){
      setRangeModalData('afternoon');
      setRangeModalVisibility(true);
    }
  }

  function handleSetMorningHour(hour: HourInterface){
    setMorningHour(hour);
    onCloseRangeModal();
  }

  function handleSetAfternoonHour(hour: HourInterface){
    setAfternoonHour(hour);
    onCloseRangeModal();
  }

  function onCloseRangeModal(){
    setRangeModalVisibility(false);
  }

  useEffect(()=> {
    setIsLoading(true);
    const mes = getYearMontSring();
    const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
    const getData = async () => {
      const dataSnap = await getDoc(dockRef);
      const dates = dataSnap.data();
      if(!dates){
        return;
      }
      const mark = {} as MarkedDates;
      dates?.days.map((day: string) => (
        mark[day] = {selected: true, selectedColor: 'red'}
      ));

      setAfternoonHour(dates?.afternoonHour);
      setMorningHour(dates?.morningHour);
      setSelected(mark);
    };

    getData();
    setIsLoading(false);
  }, []);


  return (
    <Container>
      <CalendarContainer>
        <Text weight='600' size={16} style={{alignSelf: 'center', marginBottom: 16}}>Selecione os dias que ira atender</Text>
        {isLoading ? (
          <CenteredContainer>
            <ActivityIndicator size='large' />
          </CenteredContainer>
        ) :
          <CustomCalendar selected={selected} handleSelectDay={handleSelectDay}/>
        }
      </CalendarContainer>
      <OptionsContaier>
        <CheckBoxContainer
          onPress={handleSelectNotWorkAtWeekends}
        >
          <Text size={16}>Nao atender fins de semana</Text>
          <Check>
            {notWorkAtWeekends ? <AntDesign name="check" size={24} color="green" /> : null }
          </Check>
        </CheckBoxContainer>
        <ServiceContainer>
          <Text style={{alignSelf: 'center', marginTop: 24, marginBottom: 8}} weight='600'>Horario de atendimento</Text>
          <ServiceHourSelection>
            <MorningContainer
              onPress={() => handleSelectHour('morning')}
            >
              <Text style={{alignSelf: 'center'}}>Manhã</Text>
              <Text>
                {`${morningHour.from.hour}:${morningHour.from.minutes} `}
                ás
                {` ${morningHour.to.hour}:${morningHour.to.minutes}`}
              </Text>
            </MorningContainer>
            <AfternoonContainer
              onPress={() => handleSelectHour('afternoon')}
            >
              <Text style={{alignSelf: 'center'}}>Tarde/noite</Text>
              <Text>
                {`${afternoonHour.from.hour}:${afternoonHour.from.minutes} `}
                ás
                {` ${afternoonHour.to.hour}:${afternoonHour.to.minutes}`}
              </Text>
            </AfternoonContainer>
          </ServiceHourSelection>
        </ServiceContainer>
        {error && (<Text color='red' size={16} style={{alignSelf: 'center', margin: 8}}>{error}</Text>)}
        <Button
          onPress={sendDaysToWork}
        >
          Salvar configuraçoes
        </Button>
      </OptionsContaier>
      <RangeModal
        visible={rangeModalVisibility}
        setAfternoon={handleSetAfternoonHour}
        setMorning={handleSetMorningHour}
        status={rangeModalData}
        onClose={onCloseRangeModal}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 100,
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});


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
