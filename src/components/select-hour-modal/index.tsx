import { ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { CloseModal, Container, Header, ModalBody, Overlay } from './styles';
import { Text } from '../Text';
import {AntDesign} from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getDateWithSelectedDay } from '../../utils/date';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

//TODO: give a good name to this and it can be use in other parts of the code.. add to types...
export interface AvaliableHoursInterface {
  hour: string;
  min: string;
}
interface IScheduleModal {
  visible: boolean;
  onClose: () => void;
  setTime: ({hour, min}: AvaliableHoursInterface) => void;
  day: number | null;

}


export function SelectHourModal({visible, onClose, setTime, day}: IScheduleModal){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avaliableHours, setAvaliableHours] = useState<AvaliableHoursInterface[]>([{hour: '00', min: '00'}]);

  const handleHourChange = ({hour, min}: AvaliableHoursInterface) => {
    setTime({hour, min});
    onClose();
  };


  useEffect(() => {
    const databseHours: AvaliableHoursInterface [] = [{hour: '00', min: '00'}];
    const getData = async () => {
      if(! day){
        return;
      }
      setIsLoading(true);
      const documentId = getDateWithSelectedDay(day);
      const docRef = doc(FIREBASE_DB, 'DiaHora', documentId);
      const dataSnap = await getDoc(docRef);
      if(dataSnap.exists()){
        const data = dataSnap.data();
        const hours = data.horas;
        hours.forEach((v: string) => {
          const [hr, min] = v.split(':');
          const hour = {
            hour: hr,
            min: min
          };
          databseHours.push(hour);

        });
      }
      setAvaliableHours(databseHours);
      setIsLoading(false);
    };

    getData();
  },[day]);

  return(
    <Modal
      visible={visible}
      animationType='slide'
    >
      <Overlay>
        <ModalBody>
          <Header>
            <Text size={20} weight='600' color='#666'>Selecione o horario</Text>
            <CloseModal
              onPress={() => {
                onClose();
              }}>
              <Text><AntDesign name="closecircleo" size={30} color="orange" /></Text>
            </CloseModal>
          </Header>
          {isLoading ? <ActivityIndicator color='#FF6000' size='large'/> : (
            <Container>
              <Picker
                style={styles.picker}
                selectedValue={{hour: '00', min: '00'}}
                onValueChange={handleHourChange}

                mode='dropdown'
              >
                {avaliableHours.length > 0 && (
                  avaliableHours.map((hr) => {
                    const {hour, min} = hr;
                    return (
                      <Picker.Item key={hour} label={`${hour}:${min}`} value={hr} />
                    );
                  })
                )}
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
    width: 150,
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

