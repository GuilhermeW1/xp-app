import { ActivityIndicator, Modal } from 'react-native';
import { CloseModal, Header, ModalBody, Overlay } from './styles';
import { Text } from '../Text';
import {AntDesign} from '@expo/vector-icons';
import CustomCalendar from '../CustomCalendar';
import { useEffect, useState } from 'react';
import { MarkedDates } from 'react-native-calendars/src/types';
import { addDaysToToday, getToday, getYearMontSring } from '../../utils/date';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';

interface IScheduleModal {
  visible: boolean;
  onClose: () => void;
  handleSelectDay: (day: number) => void
}

export function ScheduleModal({visible, onClose, handleSelectDay}: IScheduleModal){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<MarkedDates>({});

  function handleDayPress(day: number){
    handleSelectDay(day);
    onClose();
  }

  const getData = async () => {
    setIsLoading(true);
    const mes = getYearMontSring();
    const dockRef = doc(FIREBASE_DB, 'Atendimento', mes);
    const dataSnap = await getDoc(dockRef);
    const dates = dataSnap.data();
    const mark = {} as MarkedDates;
    dates?.days.map((day: string) => (
      mark[day] = {selected: true, selectedColor: 'red', disabled: true}
    ));

    setSelected(mark);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  },[]);


  return(
    <Modal
      visible={visible}
      animationType='slide'
    >
      <Overlay>
        <ModalBody>
          <Header>
            <Text size={20} weight='600' color='#666'>Selecione o dia</Text>
            <CloseModal onPress={onClose}><Text><AntDesign name="closecircleo" size={30} color="orange" /></Text></CloseModal>
          </Header>
          {isLoading ? <ActivityIndicator color='#FF6000' size='large'/> : (
            <CustomCalendar
              handleSelectDay={({day}) => handleDayPress(day)}
              selected={selected}
              minDays={getToday()}
              maxDays={addDaysToToday(30)}
            />
          )}
        </ModalBody>
      </Overlay>
    </Modal>
  );
}
