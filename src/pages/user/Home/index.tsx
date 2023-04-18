import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import type { MarkedDates } from 'react-native-calendars/src/types';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import CustomCalendar from '../../../components/CustomCalendar';
import { Text } from '../../../components/Text';
import { getYearMontSring } from '../../../utils/date';

export default function HomeUser(){
  const [selected, setSelected] = useState<MarkedDates>({} as MarkedDates);

  useEffect(()=> {
    const mes = getYearMontSring();
    console.log(mes);
    const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
    const getData = async () => {
      const dataSnap = await getDoc(dockRef);
      const dates = dataSnap.data();
      const mark = {} as MarkedDates;
      dates?.days.map((day: string) => (
        mark[day] = {selected: true, selectedColor: 'red', disabled: true}
      ));
      setSelected(mark);
    };

    getData();
  }, []);



  function getToday(){
    const today = new Date(Date.now());
    const [date] = today.toISOString().split('T');
    return date;
  }

  return(
    <Calendar
      markedDates={selected}
      onDayPress={({day}) => alert(day)}
      disableArrowLeft
      minDate={getToday()}
      disableAllTouchEventsForDisabledDays
    />
  );
}
