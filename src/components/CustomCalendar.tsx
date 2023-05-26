import { Calendar,LocaleConfig } from 'react-native-calendars';
import type { DateData, MarkedDates } from 'react-native-calendars/src/types';

LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro',
    'Feveriro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'br';

interface CustomCalendarProps {
  selected: MarkedDates;
  handleSelectDay: (date: DateData) => void;
  minDays?: string;
  maxDays?: string;
}

export default function CustomCalendar({selected, handleSelectDay, minDays, maxDays}: CustomCalendarProps){
  // function handelDisableWeekend(){
  //   const mark = {} as MarkedDates;

  //   const date = new Date(Date.now());
  //   const year = date.getFullYear();
  //   const month = date.getMonth() +1;
  //   const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //   let maxDays = days[month];
  //   if(month == 1){ //febrary
  //     if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
  //       maxDays += 1;
  //     }
  //   }

  //   for(let i =1; i <= maxDays; i++){
  //     const date = new Date(`${year}-${month}-${i}`);
  //     const dateString = `${year}-${month}-${i}`;
  //     if(date.getDay() == 5 || date.getDay() == 6){
  //       mark[format(dateString)] = { selectedColor: 'red', selected: true, disabled: true};
  //     }
  //   }
  //   setSelected(mark);
  // }




  // function formatDate(dateToFormat: string | Date | number){

  //   const date = new Date(dateToFormat);
  //   // console.log(date);
  //   const dateFormat = date.getFullYear() + '-' +((date.getMonth()+1).toString().length != 2 ? '0' + (date.getMonth() + 1) : (date.getMonth()+1)) + '-' + (date.getDate().toString.length != 2 ?'0' + date.getDate() : date.getDate());
  //   return dateFormat;
  // }

  // function format(date: string){
  //   let d: string;
  //   let m: string;
  //   const [year, month, day] = date.split('-');

  //   // eslint-disable-next-line prefer-const
  //   m = month.length != 2 ? '0' + month : month;
  //   // eslint-disable-next-line prefer-const
  //   d = day.length != 2 ? '0' + day : day;
  //   return `${year}-${m}-${d}`;
  // }

  // function maxDaysFunction(){
  //   const date = new Date(Date.now());
  //   date.setDate(date.getDate() + 30);
  //   const dateFormat = date.getFullYear() + '-' +((date.getMonth()+1).toString().length != 2 ? '0' + (date.getMonth() + 1) : (date.getMonth()+1)) + '-' + (date.getDate().toString.length != 2 ?'0' + date.getDate() : date.getDate());
  //   return dateFormat;
  // }

  // function disabledWeekend(){
  //   const mark = {} as MarkedDates;

  //   const date = new Date(Date.now());
  //   const year = date.getFullYear();
  //   const month = date.getMonth() +1;
  //   const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //   let maxDays = days[month];
  //   if(month == 1){ //febrary
  //     if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
  //       maxDays += 1;
  //     }
  //   }

  //   for(let i =1; i <= maxDays; i++){
  //     const date = new Date(`${year}-${month}-${i}`);
  //     const dateString = `${year}-${month}-${i}`;
  //     if(date.getDay() == 5 || date.getDay() == 6){
  //       mark[format(dateString)] = { selectedColor: 'red', selected: true, disabled: true};
  //     }
  //   }
  //   return mark;
  // }

  // function handleSelectDay(day: any){
  //   const weekDay = new Date(day.dateString).getDay();
  //   if(weekDay === 6 || weekDay === 5){
  //     return;
  //   }
  //   console.log(day);
  // }

  // function firstDayMonth(){
  //   const date = new Date(Date.now());
  //   const toFormat = `${date.getFullYear()}-${date.getMonth() +1}-01`;
  //   const formated = format(toFormat);

  //   return formated;
  // }

  //aqui tinha uma margem de 20px para tela do adm
  return(
    <Calendar
      markedDates={selected}
      disableAllTouchEventsForDisabledDays
      disabledDaysIndexes={[0,6]}
      onDayPress={(date) => handleSelectDay(date)}
      minDate={minDays}
      maxDate={maxDays}
    />
  );
}
