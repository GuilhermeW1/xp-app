
import { CalendarContainer, Check, CheckBoxContainer, Container, OptionsContaier, SendConfigurations } from './styles';
import { Text } from '../../../components/Text';
import CustomCalendar from '../../../components/CustomCalendar';
import { useState } from 'react';
import {AntDesign} from '@expo/vector-icons';
import type { DateData, MarkedDates } from 'react-native-calendars/src/types';


export function Home(){
  const [notWorkAtWeekends, setNotWorkAtWeekend] = useState(false);
  const [selected, setSelected] = useState<MarkedDates>({});
  console.log(selected);

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
        mark[format(dateString)] = { selectedColor: 'red', selected: true};
      }
    }

    setSelected({...selected, ...mark});
  }

  function format(date: string){
    let d: string;
    let m: string;
    const [year, month, day] = date.split('-');

    // eslint-disable-next-line prefer-const
    m = month.length != 2 ? '0' + month : month;
    // eslint-disable-next-line prefer-const
    d = day.length != 2 ? '0' + day : day;
    return `${year}-${m}-${d}`;
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
        mark[format(dateString)] = { selectedColor: '', selected: false};
      }
    }
    // console.log(mark);
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
      </OptionsContaier>
      <SendConfigurations>
        <Text size={20} color='#fff'>Salvar configuraçoes</Text>
      </SendConfigurations>
    </Container>
  );
}
