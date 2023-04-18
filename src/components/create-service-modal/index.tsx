import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { Text } from '../Text';
import { CreateServiceButton, ModalBody, NameInput, Overlay, TimeInput, ValueInput, CloseModal, ModalOptionsSave, CancelServiceButton, ModalHeader } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { CreateService, ServicesProps, UpdateService } from '../../pages/admin/dashboard';

interface ModalProps {
  visible: boolean,
  closeModal: () => void,
  service: ServicesProps | null,
  cancelEditService: () => void,
  createService: (service: CreateService) => Promise<void>
  editService: (service: UpdateService) => Promise<void>
}

export function CreateServiceModal({visible, closeModal, service, cancelEditService, createService, editService}: ModalProps){
  // console.log(service?.name);
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
  }

  async function handleEditService(){
    if(!service) return;
    await editService({id: service.id, name: serviceName, price: parseFloat(servicePrice), time: parseFloat(serviceTime)});
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
              <CancelServiceButton
                onPress={cancelEditService}
              >
                <Text>Cancelar</Text>
              </CancelServiceButton>
              <CreateServiceButton
                onPress={handleEditService}
              >
                <Text color='#666'>Salvar</Text>
              </CreateServiceButton>
            </ModalOptionsSave>
          ) :
            (
              <CreateServiceButton
                onPress={handleCreateService}
              >
                <Text>Criar servico</Text>
              </CreateServiceButton>
            )
          }

        </ModalBody>
      </Overlay>
    </Modal>
  );
}
