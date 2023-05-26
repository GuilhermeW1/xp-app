import { Modal } from 'react-native';
import { ConfirmButton, Container } from './styles';
import { Text } from '../Text';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ConfirmModal({visible, onClose}: ConfirmModalProps){
  return(
    <Modal
      visible={visible}
      animationType='slide'
    >
      <Container>
        <Text color='#fff' size={20} weight='600'>Agendamento feito com sucesso</Text>
        <ConfirmButton onPress={onClose}>
          <Text color='#fff' weight='700' size={24}>Ok</Text>
        </ConfirmButton>
      </Container>
    </Modal>
  );
}
