import { Picker } from '@react-native-picker/picker';
import { Text } from '../Text';
import { Modal, StyleSheet } from 'react-native';
import { CloseModal, Container, ModalBody, Overlay } from './styles';
import { useState } from 'react';
import { Button } from '../button';

import type { HourInterface } from '../../pages/admin/configurations-page';

import {AntDesign} from '@expo/vector-icons';

interface RangeModalInterface {
  visible: boolean;
  setMorning: (hour: HourInterface) => void;
  setAfternoon: (hour: HourInterface) => void;
  status: string;
  onClose: () => void;
}

export function RangeModal({visible, setMorning, setAfternoon, status, onClose}: RangeModalInterface){
  const [firstHour, setFirstHour] = useState('00');
  const [firstMinutes, setFirstMinutes] = useState('00');
  const [secondHour, setSecondHour] = useState('00');
  const [secondMinutes, setSecondMinutes] = useState('00');
  const [error, setError] = useState('');


  const hour = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
  const min = ['00', '15', '30', '45'];

  function handleConfirm(){
    if(firstHour === '00' || secondHour === '00'){
      setError('Hora nao selecionada');
      return;
    }
    if(parseInt(firstHour) > parseInt(secondHour)){
      setError('O primeiro horario nao pode ser menor que o segundo');
      return;
    }
    if(firstHour === secondHour && parseInt(firstMinutes) > parseInt(secondMinutes)){
      setError('O primeiro horario nao pode ser menor que o segundo');
      return;
    }
    if(firstHour === secondHour && firstMinutes === secondMinutes){
      setError('Horas iguais');
      return;
    }

    const hour: HourInterface = {
      from: {
        hour: firstHour,
        minutes: firstMinutes
      },
      to: {
        hour: secondHour,
        minutes: secondMinutes
      }
    };

    if(status == 'morning'){
      setMorning(hour);
    }
    if(status == 'afternoon'){
      setAfternoon(hour);
    }

    setFirstHour('00');
    setSecondHour('00');
    setFirstMinutes('00');
    setSecondMinutes('00');
    setError('');
  }


  return(
    <Modal
      transparent
      visible={visible}
    >
      <Overlay>
        <ModalBody>
          {error && (<Text color='red' style={{alignSelf: 'center'}}>{error}</Text>)}
          <CloseModal onPress={onClose}><Text><AntDesign name="closecircleo" size={30} color="orange" /></Text></CloseModal>
          <Text>Das</Text>
          <Container>
            <Picker
              style={styles.picker}
              mode='dropdown'
              selectedValue={firstHour}
              onValueChange={hr => setFirstHour(hr)}
            >
              {hour.map((hr)=> (
                <Picker.Item value={hr} key={hr} label={hr}/>
              ))}
            </Picker>
            <Text style={styles.separator}>:</Text>
            <Picker
              mode='dropdown'
              style={styles.picker}
              selectedValue={firstMinutes}
              onValueChange={min => setFirstMinutes(min)}
            >
              {min.map((min)=> (
                <Picker.Item value={min} key={min} label={min}/>
              ))}
            </Picker>

          </Container>
          <Text>Ate</Text>
          <Container>
            <Picker
              style={styles.picker}
              mode='dropdown'
              selectedValue={secondHour}
              onValueChange={hr => setSecondHour(hr)}
            >
              {hour.map((hr)=> (
                <Picker.Item value={hr} key={hr} label={hr}/>
              ))}
            </Picker>
            <Text style={styles.separator}>:</Text>
            <Picker
              mode='dropdown'
              style={styles.picker}
              selectedValue={secondMinutes}
              onValueChange={min => setSecondMinutes(min)}
            >
              {min.map((min)=> (
                <Picker.Item value={min} key={min} label={min}/>
              ))}
            </Picker>
          </Container>
          <Button
            onPress={handleConfirm}
          >
            Confirmar
          </Button>
        </ModalBody>

      </Overlay>
    </Modal>

  );
}

const styles = StyleSheet.create({
  picker: {
    width: 120,
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

