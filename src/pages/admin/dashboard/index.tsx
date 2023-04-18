import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { Text } from '../../../components/Text';

import { useAuth } from '../../../context/auth-context';
import { Container, CreateService, DeleteService, EditContainer, EditService, InfoContainer, Separetor, ServiceContainer, SignOutButton } from './styles';
import { AntDesign } from '@expo/vector-icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import { CreateServiceModal } from '../../../components/create-service-modal';

export interface ServicesProps {
  id: string;
  name: string;
  price: number;
  time: number;
}

export type CreateService = Omit<ServicesProps, 'id'>

export type UpdateService = ServicesProps

export function Dashboard(){
  const {signOut} = useAuth();
  const [services, setServices] = useState<ServicesProps[]>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [service, setService] = useState<null | ServicesProps>(null);

  const handleCloseModal = useCallback(() => {
    setService(null);
    setModalVisibility(false);
  },[]);

  const handleOpenModal = useCallback(() => {
    setService(null);
    setModalVisibility(true);
  },[]);

  function handleEditServiceModal(service: ServicesProps){
    setService(service);
    setModalVisibility(true);
  }

  function cancelEditService(){
    console.log('rendered');
    setService(null);
    setModalVisibility(false);
  }

  async function handleDeleteService(id: string){
    try{
      await deleteDoc(doc(FIREBASE_DB, 'Servicos', id));
      setServices(prev => prev.filter(el => el.id != id));
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
      setServices(prev => [...prev, ser]);
    }catch(error){
      throw new Error('Erro ao criar um servico');
    }
    alert('servico criado');
    handleCloseModal();
  }

  async function handleEditService({id, name, price, time}: UpdateService): Promise<void>{
    if(!service) return;
    if(!name || !price || !time){
      return;
    }

    const ser = {
      nome: name,
      valor: price,
      tempo: time,
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
          };
        }
        return item;
      }) );
    }catch(error){
      throw new Error('Erro ao editar servico');
    }
    alert('servico criado');
    handleCloseModal();
  }

  useEffect(() => {
    const getServices = async() => {
      const dbService: ServicesProps[] = [];
      try{
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Servicos'));

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const service = {
            id: doc.id,
            name: data.nome,
            price: data.valor,
            time: data.tempo
          };
          dbService.push(service);
        });
      }catch(error){
        throw new Error();
      }
      setServices(dbService);
    };
    getServices();
  },[]);

  return (
    <Container>
      <Text style={{alignSelf: 'center', marginTop: 16}} weight='700' size={24}>Serviços</Text>
      <CreateService
        onPress={handleOpenModal}
      >
        <Text>Adicionar servico +</Text>
      </CreateService>
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
                onPress={() => handleDeleteService(service.id)}
              >
                <AntDesign name='delete' size={24} color='red'/>
              </DeleteService>
            </EditContainer>
          </ServiceContainer>
        )}
      />

      <CreateServiceModal
        visible={modalVisibility}
        closeModal={handleCloseModal}
        service={service}
        cancelEditService={cancelEditService}
        createService={handleCreateService}
        editService={handleEditService}
      />
    </Container>
  );
}
