import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../../firebaseConfig';
import { Text } from '../../../components/Text';
import { CenteredContainer, Container, DeleteService, EditContainer, EditService, Image, InfoContainer, Separetor, ServiceContainer } from './styles';
import { AntDesign } from '@expo/vector-icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import { CreateServiceModal } from '../../../components/create-service-modal';
import * as ImagePicker from 'expo-image-picker';

import type { Service } from '../../../types/service';
import { DeleteModal } from '../../../components/delete-modal';
import { Button } from '../../../components/button';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';



export interface IService extends Service {
  imageUrl: string | null;
}
export type CreateService = Omit<IService, 'imagePath' | 'id'>

export type UpdateService = Omit<IService, 'imagePath'>

export function ServicesPage(){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [services, setServices] = useState<IService[]>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [service, setService] = useState<null | IService>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();


  const handleCloseModal = useCallback(() => {
    setService(null);
    setModalVisibility(false);
  },[]);

  const handleOpenModal = useCallback(() => {
    setService(null);
    setModalVisibility(true);
  },[]);

  function handleEditServiceModal(service: IService){
    setService(service);
    setModalVisibility(true);
  }

  function cancelEditService(){
    setService(null);
    setModalVisibility(false);
  }

  async function handleDeleteService(id: string){
    const serviceToDelete = services.find(item => item.id === id);
    try{
      if(serviceToDelete?.imagePath){
        await Promise.all(
          [
            deleteDoc(doc(FIREBASE_DB, 'Servicos', id)),
            deleteObject(ref(FIREBASE_STORAGE, serviceToDelete.imagePath))
          ]
        );
      }else {
        deleteDoc(doc(FIREBASE_DB, 'Servicos', id));
      }

      setServices(prev => prev.filter(el => el.id != id));
      setDeleteModalVisible(false);
    }catch(err){
      throw new Error('erro ao deletar arquivo'+ err);
    }
  }

  async function handleCreateService({name, price, time, imageUrl}: CreateService): Promise<void>{
    if(!name || !price || !time){
      return;
    }

    const date = Date.now();
    const path = `images/${date}`;

    if(imageUrl){
      try{
        //fetch the image from the users phone
        const image = await fetch(imageUrl);
        //than create a blob
        const blob = await image.blob();
        //than upload the image
        const imageRef = ref(FIREBASE_STORAGE, path);
        await uploadBytes(imageRef, blob);

      }catch(error){
        throw new Error('erro ao salvar a imagem' + error);
      }
    }

    const service = {
      nome: name,
      valor: price,
      tempo: time,
      imagePath: path ?? null
    };
    try{
      const res = await addDoc(collection(FIREBASE_DB, 'Servicos'), service);

      //NOTE: where you create he service the first imageUlr points to the users phone path because
      // the insert of the image in the firebase storage takes a while and i cant search the image to get his path
      const ser = {
        id: res.id,
        name,
        price,
        time,
        imagePath:  path,
        imageUrl: imageUrl ?? null,

      };
      setServices(prev => [...prev, ser]);
    }catch(error){
      throw new Error('Erro ao criar um servico' + error);
    }
    setService(null);
    alert('servico criado');
  }

  async function handleEditService({id, name, price, time, imageUrl}: UpdateService): Promise<void>{
    if(!service) return;
    if(!name || !price || !time){
      return;
    }

    //it means that the service that i send to de modal have changed the image
    let path = service.imagePath;
    if(service.imageUrl !== imageUrl && imageUrl){
      const date = Date.now();
      path = `images/${date}`;

      const oldImage = service.imagePath;
      if(oldImage){
        await deleteObject(ref(FIREBASE_STORAGE, oldImage));
      }

      const image = await fetch(imageUrl);
      const blob = await image.blob();
      await uploadBytes(ref(FIREBASE_STORAGE, path), blob);
    }

    const ser = {
      nome: name,
      valor: price,
      tempo: time,
      imagePath: path ?? null
    };

    try{
      await setDoc(doc(FIREBASE_DB, 'Servicos', service?.id), ser);
      setServices(prev => prev.map((item) => {
        if(item.id == id){
          item = {
            id,
            name,
            price,
            time,
            imagePath: path ?? null,
            imageUrl: imageUrl ?? null,
          };
        }
        return item;
      }) );
    }catch(error){
      throw new Error('Erro ao editar servico');
    }
    handleCloseModal();
  }

  function handleDelete(id: string){
    setDeleteId(id);
    setDeleteModalVisible(true);
  }

  useEffect(() => {
    (async() => {
      setIsLoading(true);
      try{
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));

        const servicesPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imagePath = data.imagePath ?? null;
          let url;
          if(imagePath){
            const imageRef = ref(FIREBASE_STORAGE, imagePath);
            try{
              url = await getDownloadURL(imageRef);
            }catch(error){
              console.log(error);
              throw new Error('erro ao buscar imagePath do servico');
            }
          }
          return {
            id: doc.id,
            name: data.nome,
            price: data.valor,
            time : data.tempo,
            imagePath: imagePath ?? null,
            imageUrl: url ?? null
          };

        });
        const services = await Promise.all(servicesPromises);
        setServices(services);
        setIsLoading(false);
      }catch(error){
        setIsLoading(false);
        throw new Error('erro ao buscar servicos');
      }
    })();

    if(status?.status !== 'granted'){
      (async () => await requestPermission())();
    }
  },[status, requestPermission]);

  return (
    <Container>
      <Text style={{alignSelf: 'center', marginBottom: 16}} weight='700' size={24}>Serviços</Text>
      {isLoading ?
        (
          <CenteredContainer>
            <ActivityIndicator size='large'  />
          </CenteredContainer>
        ) : ( services.length === 0 ? (
          <CenteredContainer>
            <Text size={24} weight='600' color='#666'>Nenhum serviço</Text>
            <Text size={24} weight='600' color='#666' style={{marginVertical: 8}}>Adicione serviços</Text>
            <Text size={24} weight='600' color='#666'> no botão abaixo</Text>
          </CenteredContainer>
        ) :
          <FlatList
            data={services}
            keyExtractor={(service) => service.id}
            ItemSeparatorComponent={Separetor}
            contentContainerStyle={{paddingBottom: 70}}
            showsVerticalScrollIndicator={false}
            renderItem={({item: service}) => (
              <ServiceContainer>
                {service.imageUrl !== null && !undefined && <Image source={{ uri: service.imageUrl }}/>}
                <InfoContainer>
                  <Text weight='600'>{service.name}</Text>
                  <Text size={14} >Tempo: {service.time} min</Text>
                  <Text size={14} color='#666'>{formatCurrency(service.price)}</Text>
                </InfoContainer>
                <EditContainer>
                  <EditService
                    onPress={() => handleEditServiceModal(service)}
                  >
                    <AntDesign name='edit' size={24} color='black'/>
                  </EditService>
                  <DeleteService
                    onPress={() => handleDelete(service.id)}
                  >
                    <AntDesign name='delete' size={24} color='red'/>
                  </DeleteService>
                </EditContainer>
              </ServiceContainer>
            )}
          />
        )}

      <Button
        onPress={handleOpenModal}
      >
        Adicionar servico +
      </Button>
      <CreateServiceModal
        visible={modalVisibility}
        closeModal={handleCloseModal}
        service={service}
        cancelEditService={cancelEditService}
        createService={handleCreateService}
        editService={handleEditService}
      />
      <DeleteModal
        visible={deleteModalVisible}
        onDelete={handleDeleteService}
        id={deleteId}
        onClose={() => setDeleteModalVisible(false)}
      />
    </Container>
  );
}
