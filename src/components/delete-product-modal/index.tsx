import {  Modal } from 'react-native';
import { Container, ModalBody, Overlay } from './styles';
import { Button } from '../button';
import { Text } from '../Text';
import { SecondaryButton } from '../secondary-button';

export interface DeleteModal {
    visible: boolean;
    onDelete: (id: string) => Promise<void>;
    id: string;
    onClose: () => void
}

export function DeleteProductModal({visible, onDelete, id , onClose}: DeleteModal){
  async function handleDelete(){
    await onDelete(id);
  }

  return(
    <Modal
      visible={visible}
      transparent
    >
      <Overlay>

        <ModalBody>
          <Text weight='600' size={20} style={{alignSelf: 'center', marginVertical: 16}}>Tem certeza que deseja excluir?</Text>
          <Container>

            <SecondaryButton
              onPress={handleDelete}
            >
              Ok
            </SecondaryButton>
            <Button
              onPress={onClose}
            >
              Cancel
            </Button>
          </Container>
        </ModalBody>

      </Overlay>
    </Modal>
  );
}
