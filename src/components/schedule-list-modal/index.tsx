import { Modal } from 'react-native';
import { Text } from '../Text';
import { useEffect, useState } from 'react';
import { collection,onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { ScheduleInterface } from '../../types/Schedule';
import { CloseModal, InfoContainer, ItemContainer, ModalBody, Overlay, ScheduleItem, Separetor, ServicesList, TimeContainer } from './styles';
import { FlatList } from 'react-native-gesture-handler';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatTime } from '../../utils/formatTime';
import {AntDesign} from '@expo/vector-icons';
import { generateRandomId } from '../../utils/randomId';

interface ScheduleListModal {
  visible: boolean;
  userId: string;
  onClose: () => void;
  history?: boolean
}

interface SchedulesList extends ScheduleInterface {
  id: string;
}


export function ScheduleListModal({visible, userId, onClose, history}: ScheduleListModal){
  const [schedules ,setSchedules] = useState<SchedulesList[]>([] as SchedulesList[]);

  useEffect(() => {
    const dbSchedules:SchedulesList[] = [];
    const date = new Date();

    let dbQuery;
    if(history){
      dbQuery = query(collection(FIREBASE_DB ,'Agendamento') ,where('userId', '==', userId));
    }else{
      dbQuery = query(collection(FIREBASE_DB ,'Agendamento') ,where('userId', '==', userId), where('date', '>', date));

    }

    const unsubscribe = onSnapshot(dbQuery, (snapshot) => {
      if(snapshot.empty){
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        const item = {
          id: generateRandomId(8),
          userId: data.userId,
          price: data.price,
          date: data.date,
          services: data.services,
          time: data.time
        };
        dbSchedules.push(item);
      });
      setSchedules(dbSchedules);
    }, (error) => {console.log(error);});
    return () => unsubscribe();
  }, [userId, history]);

  return(
    <Modal
      visible={visible}
      transparent
      animationType='slide'
    >
      <Overlay>
        <ModalBody>
          <CloseModal onPress={onClose}>
            <Text><AntDesign name="closecircleo" size={30} color="orange" /></Text></CloseModal>
          <FlatList
            style={{marginTop: 24}}
            data={schedules}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={Separetor}
            renderItem={({item: schedule}) => {
              const {seconds} = schedule.date;
              const date = new Date(seconds * 1000);
              const [formatedDate, fullHour] = date.toLocaleString('pt-BR').split(' ');
              const [hour, minutes] = fullHour.split(':');
              return(
                <ScheduleItem>
                  <ServicesList>
                    {schedule.services.map((doc, index) => {
                      return(
                        <Text key={index} weight='600' color='#666'>{doc.name}</Text>
                      );})}
                  </ServicesList>
                  <ItemContainer>
                    <TimeContainer>
                      <Text size={14}>{`${hour}:${minutes}`}</Text>
                      <Text size={14}>{formatedDate}</Text>
                    </TimeContainer>
                    <InfoContainer>
                      <Text size={14}>{formatTime(schedule.time)}</Text>
                      <Text size={14} style={{marginBottom: 20}}>{formatCurrency(schedule.price)}</Text>
                    </InfoContainer>
                  </ItemContainer>
                </ScheduleItem>
              );}}
          />
        </ModalBody>
      </Overlay>
    </Modal>
  );
}
