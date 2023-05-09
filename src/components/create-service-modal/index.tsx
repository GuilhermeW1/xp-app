import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { Text } from '../Text';
import { CreateServiceButton, ModalBody, NameInput, Overlay, TimeInput, ValueInput, CloseModal, ModalOptionsSave, CancelServiceButton, ModalHeader } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { CreateService, UpdateService } from '../../pages/admin/dashboard';
import type { Service } from '../../types/service';
import { Button } from '../button';
import { SecondaryButton } from '../secondary-button';

interface ModalProps {
  visible: boolean,
  closeModal: () => void,
  service: Service | null,
  cancelEditService: () => void,
  createService: (service: CreateService) => Promise<void>
  editService: (service: UpdateService) => Promise<void>
}

export function CreateServiceModal({visible, closeModal, service, cancelEditService, createService, editService}: ModalProps){
  const [serviceName, setServiceName] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  useEffect(() => {
    if(service == null){
      setServiceName('');
      setServicePrice('');
      setServiceTime('');
      return;
    }else {
      setServiceName(service.name);
      setServicePrice(service.price.toString());
      setServiceTime(service.time.toString());
    }
  }, [service]);


  async function handleCreateService(){
    await createService({name: serviceName, price: parseFloat(servicePrice), time: parseFloat(serviceTime)});
    setServiceName('');
    setServicePrice('');
    setServiceTime('');
  }

  async function handleEditService(){
    if(!service) return;
    await editService({id: service.id, name: serviceName, price: parseFloat(servicePrice), time: parseFloat(serviceTime)});
    setServiceName('');
    setServicePrice('');
    setServiceTime('');
  }

  return(
    <Modal
      visible={visible}
      transparent
    >
      <Overlay>
        <ModalBody>
          <ModalHeader>
            {service? <Text weight='600'>Editar</Text> : <Text weight='600'>Criar serviço</Text>}
            <CloseModal
              onPress={closeModal}
            >
              <AntDesign name="closecircleo" size={30} color="red" />
            </CloseModal>
          </ModalHeader>
          <Text>Nome do servico</Text>
          <NameInput
            value={serviceName}
            onChangeText={setServiceName}
            keyboardType='ascii-capable'
          />

          <Text>Tempo em min</Text>
          <TimeInput
            value={serviceTime}
            onChangeText={setServiceTime}
            keyboardType='numeric'
          />
          <Text>Valor do servico</Text>
          <ValueInput
            value={servicePrice}
            onChangeText={setServicePrice}
            keyboardType='numeric'
          />
          { service ? (
            <ModalOptionsSave>
              <Button
                onPress={cancelEditService}
              >
                Cancelar
              </Button>
              <SecondaryButton
                onPress={handleEditService}
              >

                Salvar
              </SecondaryButton>
            </ModalOptionsSave>
          ) :
            (
              <Button
                onPress={handleCreateService}
              >
                Criar servico
              </Button>
            )
          }

        </ModalBody>
      </Overlay>
    </Modal>
  );
}
