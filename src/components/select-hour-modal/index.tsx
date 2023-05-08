import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { CloseModal, Container, Header, ModalBody, Overlay } from './styles';
import { Text } from '../Text';
import {AntDesign} from '@expo/vector-icons';
import CustomCalendar from '../CustomCalendar';
import { useEffect, useState } from 'react';
import { MarkedDates } from 'react-native-calendars/src/types';
import { getYearMontSring } from '../../utils/date';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

interface IScheduleModal {
  visible: boolean;
  onClose: () => void;
  setMinutesModal: (min: string) => void;
  setHoursModal: (hr: string) => void;

}

export function SelectHourModal({visible, onClose, setHoursModal, setMinutesModal}: IScheduleModal){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');



  const handleHourChange = (value: string) => {
    setHours(value);
    setHoursModal(value);
  };

  const handleMinuteChange = (value: string) => {
    setMinutesModal(value);
    setMinutes(value);
  };

  const hoursData = Array.from({length: 24}, (_, i) => String(i + 1));


  const minutesData = [
    '00', '15', '30', '45'
  ];

  return(
    <Modal
      visible={visible}
    >
      <Overlay>
        <ModalBody>
          <Header>
            <Text size={20} weight='600' color='#666'>Selecione o horario</Text>
            <CloseModal onPress={onClose}><Text><AntDesign name="closecircleo" size={30} color="orange" /></Text></CloseModal>
          </Header>
          {isLoading ? <ActivityIndicator color='#FF6000' size='large'/> : (
            <Container>
              <Picker
                style={styles.picker}
                selectedValue={hours}
                onValueChange={handleHourChange}
                mode='dropdown'
              >
                {hoursData.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
              <Text style={styles.separator}>:</Text>
              <Picker
                mode='dropdown'
                style={styles.picker}
                selectedValue={minutes}
                onValueChange={handleMinuteChange}
              >
                {minutesData.map((minute) => (
                  <Picker.Item key={minute} label={minute} value={minute} />
                ))}
              </Picker>

            </Container>
          )}
        </ModalBody>
      </Overlay>
    </Modal>
  );
}

// i dont know how to do this with the styled components

const styles = StyleSheet.create({
  picker: {
    width: 110,
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   picker: {
//     width: 80,
//   },
//   separator: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
