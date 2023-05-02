import { Modal } from 'react-native';
import { ModalBody, Overlay } from './styles';
import { Text } from '../Text';
import { Calendar } from 'react-native-calendars';


interface IScheduleModal {
  visible: boolean
}

export function ScheduleModal({visible}: IScheduleModal){
  return(
    <Modal
      visible={visible}
    >
      <Overlay>
        <ModalBody>
          <Calendar/>
          <Text>Horario</Text>
        </ModalBody>
      </Overlay>
    </Modal>
  );
}
