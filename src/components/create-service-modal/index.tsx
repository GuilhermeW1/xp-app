import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { Text } from '../Text';
import { ModalBody, NameInput, Overlay, TimeInput, ValueInput, CloseModal, ModalOptionsSave, ModalHeader, ImagePickerContainer, Image, SelectImageButton, Separetor } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { CreateService, IService, UpdateService } from '../../pages/admin/services-page';
import { Button } from '../button';
import { SecondaryButton } from '../secondary-button';
import * as ImagePicker from 'expo-image-picker';
interface ModalProps {
  visible: boolean,
  closeModal: () => void,
  service: IService | null,
  cancelEditService: () => void,
  createService: (service: CreateService) => Promise<void>
  editService: (service: UpdateService) => Promise<void>
}

export function CreateServiceModal({visible, closeModal, service, cancelEditService, createService, editService}: ModalProps){
  const [serviceName, setServiceName] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>('');

  async function handleCreateService(){
    setIsLoading(true);
    await createService({name: serviceName, price: parseFloat(servicePrice), time: parseFloat(serviceTime), imageUrl: imageUrl});
    setServiceName('');
    setServicePrice('');
    setServiceTime('');
    setImageUrl('');
    setIsLoading(false);
    closeModal();
  }

  async function handleEditService(){
    if(!service) return;
    setIsLoading(true);
    await editService({id: service.id, name: serviceName, price: parseFloat(servicePrice), time: parseFloat(serviceTime), imageUrl});
    setServiceName('');
    setServicePrice('');
    setServiceTime('');
    setImageUrl('');
    setIsLoading(false);
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
      aspect: [4, 3]
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUrl(uri);
    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(() => {
    if(service == null){
      setServiceName('');
      setServicePrice('');
      setServiceTime('');
      setImageUrl('');
      return;
    }else {
      setImageUrl(service?.imageUrl ?? null);
      setServiceName(service.name);
      setServicePrice(service.price.toString());
      setServiceTime(service.time.toString());
    }
  }, [service]);

  //NOTE: aqui vai da um erro se o cara fazer a insercao e logo apos modificar pois na primeira
  // vez que e inserido ele pega a url do ceuluar
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
          <ImagePickerContainer>
            {imageUrl ?  <Image source={{uri: imageUrl}}/> : (
              <Separetor>
                <Text>Nenhuma imagem</Text>
                <Text>Selecionada</Text>
              </Separetor>)}
            <SelectImageButton onPress={pickImageAsync}>
              <FontAwesome5 name="image" size={24} color="black" />
              <Text>Selecione Imagem</Text>
            </SelectImageButton>
          </ImagePickerContainer>
          {isLoading? <ActivityIndicator size='large'/> : (service ? (
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
          ) }
        </ModalBody>
      </Overlay>
    </Modal>
  );
}
