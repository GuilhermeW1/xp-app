import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image } from 'react-native';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../../firebaseConfig';
import { Text } from '../../../components/Text';
import { CenteredContainer, Container, DeleteService, EditContainer, EditService, InfoContainer, Photo, Separetor, ServiceContainer, Teste } from './styles';
import { AntDesign } from '@expo/vector-icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import { CreateServiceModal } from '../../../components/create-service-modal';

import type { Service } from '../../../types/service';
import { DeleteModal } from '../../../components/delete-modal';
import { Button } from '../../../components/button';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export type CreateService = Omit<Service, 'id'>

export type UpdateService = Service

export function ProductsPage(){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [service, setService] = useState<null | Service>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [image, setImage] = useState('');

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleCloseModal = useCallback(() => {
    setService(null);
    setModalVisibility(false);
  },[]);

  const handleOpenModal = useCallback(() => {
    setService(null);
    setModalVisibility(true);
  },[]);

  function handleEditServiceModal(service: Service){
    setService(service);
    setModalVisibility(true);
  }

  function cancelEditService(){
    setService(null);
    setModalVisibility(false);
  }

  async function handleDeleteService(id: string){
    try{
      await deleteDoc(doc(FIREBASE_DB, 'Servicos', id));
      setServices(prev => prev.filter(el => el.id != id));
      setDeleteModalVisible(false);
    }catch(err){
      throw new Error('erro ao deletar arquivo');
    }
  }

  async function handleCreateService({name, price, time}: CreateService): Promise<void>{
    if(!name || !price || !time){
      return;
    }

    const service = {
      nome: name,
      valor: price,
      tempo: time,
    };
    try{
      const res = await addDoc(collection(FIREBASE_DB, 'Servicos'), service);
      const ser = {
        id: res.id,
        name,
        price,
        time,
      };
      // setServices(prev => [...prev, ser]) ;
    }catch(error){
      throw new Error('Erro ao criar um servico');
    }
    setService(null);
    alert('servico criado');
    handleCloseModal();
  }

  async function handleEditService({id, name, price, time}: UpdateService): Promise<void>{
    if(!service) return;
    if(!name || !price || !time){
      return;
    }

    // const ser = {
    //   nome: name,
    //   valor: price,
    //   tempo: time,
    // };
    // try{
    //   await setDoc(doc(FIREBASE_DB, 'Servicos', service?.id), ser);
    //   setServices(prev => prev.map((item) => {
    //     if(item.id == id){
    //       item = {
    //         id,
    //         name,
    //         price,
    //         time,
    //       };
    //     }
    //     return item;
    //   }) );
    // }catch(error){
    //   throw new Error('Erro ao editar servico');
    // }
    handleCloseModal();
  }

  function handleDelete(id: string){
    setDeleteId(id);
    setDeleteModalVisible(true);
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
      aspect: [3, 4]
    });
    if (!result.canceled) {
      const uri =result.assets[0].uri;
      const name = Date.now();
      const data = await fetch(uri);
      console.log(name);
      const blob = await data.blob();
      const imgaesRef = ref(FIREBASE_STORAGE, `images/${name}`);
      setImage(uri);

      try{
        const result = await uploadBytes(imgaesRef, blob);
        console.log(result);
      }catch(error){
        console.log(error);
      }
      //  .then((snapshot) => console.log('deu')).catch(error => console.log(error));

    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // (async () => {
    //   const imageRef = ref(FIREBASE_STORAGE, 'images/1684784128064');
    //   try{
    //     const url = await getDownloadURL(imageRef);
    //     setImage(url);
    //   }catch(error){
    //     console.log(error);
    //   }
    // })();

    // const getServices = async() => {
    //   const dbService: Service[] = [];
    //   try{
    //     const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));

    //     querySnapshot.forEach((doc) => {
    //       const data = doc.data();
    //       const service = {
    //         id: doc.id,
    //         name: data.nome,
    //         price: data.valor,
    //         time: data.tempo
    //       };
    //       dbService.push(service);
    //     });
    //   }catch(error){
    //     throw new Error();
    //   }
    //   setServices(dbService);
    // };
    // getServices();
    // setIsLoading(false);

    if(status?.status !== 'granted'){
      (async () => await requestPermission())();
    }
  },[requestPermission, status]);

  return (
    <Container>
      <Text style={{alignSelf: 'center', marginBottom: 16}} weight='700' size={24}>Products</Text>
      {/* {isLoading ?
        (
          <CenteredContainer>
            <ActivityIndicator size='large' color='#FF6000' />
          </CenteredContainer>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(service) => service.id}
            ItemSeparatorComponent={Separetor}
            renderItem={({item: service}) => (
              <ServiceContainer>
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
        )} */}

      <Photo onPress={pickImageAsync}>
        {
          image && (
            <Image
              style={{flex: 1, maxHeight: 96, maxWidth: 120}}
              source={{uri: image}}

            />
          )
        }
        <Text>escolher</Text>
      </Photo>
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
