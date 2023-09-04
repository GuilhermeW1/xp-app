import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
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
  ServiceContainer,
  ServiceHourSelection } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { formatDayOfStringDate, getYearMontSring } from '../../../utils/date';
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
//TODO: bug in blocked days in calendar the date push 2 dias before 9 pm i think this is the gmt - fu
//TODO: create some ref to receive te first input and compare the values of the states then disable the button if there is no change
//TODO: use useDispatch to handle all the fields in the same state
// and enable the button if is some change
export function ConfigurationsPage(){
  const init = {from: {hour: '00', minutes: '00'}, to: {hour: '00', minutes: '00'}};
  const [notWorkAtWeekends, setNotWorkAtWeekend] = useState(false);
  const [selected, setSelected] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [morningHour, setMorningHour] = useState<HourInterface>(init);
  const [afternoonHour, setAfternoonHour] = useState<HourInterface>(init);
  const [rangeModalVisibility, setRangeModalVisibility] = useState<boolean>(false);
  const [rangeModalData, setRangeModalData] = useState('');
  const [error, setError] = useState('');
  const [noConfiguration, setNoConfiguration] = useState('');

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
        mark[formatDayOfStringDate(dateString)] = { selectedColor: '#8c03fb', selected: true};
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
        mark[formatDayOfStringDate(dateString)] = { selectedColor: '', selected: false};
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
        mark[currentDate] = {selected: true, selectedColor: '#8c03fb'};
      }
    }else{
      mark[currentDate] = {selected: true, selectedColor: '#8c03fb'};
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
    try{
      await setDoc(doc(FIREBASE_DB, 'Atendimento', dateId), {
        morningHour,
        afternoonHour,
        days
      });

      alert('Configuracões salvas');
      setNoConfiguration('');
    }catch(error){
      alert('Erro ao salvar configurações');
      throw new Error('Erro ao salvar configuracoes' + error);
    }
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
    (async () => {
      setIsLoading(true);
      const mes = getYearMontSring();
      const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
      const dataSnap = await getDoc(dockRef);
      const data = dataSnap.data();
      if(!dataSnap.exists()){
        setNoConfiguration('Não ha configurações setadas');
        setIsLoading(false);
        return;
      }
      const mark = {} as MarkedDates;
      data?.days.map((day: string) => (
        mark[day] = {selected: true, selectedColor: '#8c03fb'}
      ));

      setAfternoonHour(data?.afternoonHour);
      setMorningHour(data?.morningHour);
      setSelected(mark);
      setIsLoading(false);
    })();

  }, []);


  return (
    <Container>
      <CalendarContainer>
        <Text weight='600' size={16} style={{alignSelf: 'center', marginBottom: noConfiguration ? 0 : 16}}>Selecione os dias que não ira atender</Text>
        {noConfiguration && <Text size={14} color='red' style={{alignSelf: 'center', marginBottom: 16}}>{noConfiguration}</Text>}
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
