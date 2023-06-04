import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../../firebaseConfig';
import { Text } from '../../../components/Text';
import { CenteredContainer, Container, DeleteService, EditContainer, EditService, Image, InfoContainer, Separetor, ServiceContainer } from './styles';
import { AntDesign } from '@expo/vector-icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '../../../components/button';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Product } from '../../../types/Product';
import { CreateProductModal } from '../../../components/create-product-modal';
import { DeleteProductModal } from '../../../components/delete-product-modal';

export interface IProduct extends Product {
  imageUrl: string | null;
}
export type CreateProduct = Omit<IProduct, 'imagePath' | 'id'>

export type UpdateProduct = Omit<IProduct, 'imagePath'>

export function ProductsPage(){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [product, setProduct] = useState<null | IProduct>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();


  const handleCloseModal = useCallback(() => {
    setProduct(null);
    setProductModalVisible(false);
  },[]);

  const handleOpenModal = useCallback(() => {
    setProduct(null);
    setProductModalVisible(true);
  },[]);

  function handleEditServiceModal(product: IProduct){
    setProduct(product);
    setProductModalVisible(true);
  }

  function cancelEditProduct(){
    setProduct(null);
    setProductModalVisible(false);
  }

  async function handleDeleteProduct(id: string){
    const serviceToDelete = products.find(item => item.id === id);
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

      setProducts(prev => prev.filter(el => el.id != id));
      setDeleteModalVisible(false);
    }catch(err){
      throw new Error('erro ao deletar arquivo'+ err);
    }
  }

  async function handleCreateProduct({name, price, description, imageUrl}: CreateProduct): Promise<void>{
    if(!name || !price){
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

    const product = {
      nome: name,
      valor: price,
      descricao: description ?? null,
      imagePath: path ?? null
    };
    try{
      const res = await addDoc(collection(FIREBASE_DB, 'Produtos'), product);

      //NOTE: where you create he service the first imageUlr points to the users phone path because
      // the insert of the image in the firebase storage takes a while and i cant search the image to get his path
      const prod = {
        id: res.id,
        name,
        price,
        description,
        imagePath:  path,
        imageUrl: imageUrl ?? null,

      };
      setProducts(prev => [...prev, prod]);
    }catch(error){
      throw new Error('Erro ao criar um servico' + error);
    }
    setProduct(null);
    alert('servico criado');
  }

  async function handleEditProduct({id, name, price, description, imageUrl}: UpdateProduct): Promise<void>{
    if(!product) return;
    if(!name || !price || !description){
      return;
    }

    //it means that the service that i send to de modal have changed the image
    let path = product.imagePath;
    if(product.imageUrl !== imageUrl && imageUrl){
      const date = Date.now();
      path = `images/${date}`;

      const oldImage = product.imagePath;
      if(oldImage){
        await deleteObject(ref(FIREBASE_STORAGE, oldImage));
      }

      const image = await fetch(imageUrl);
      const blob = await image.blob();
      await uploadBytes(ref(FIREBASE_STORAGE, path), blob);
    }

    const prod = {
      nome: name,
      valor: price,
      descricao: description ?? null,
      imagePath: path ?? null
    };

    try{
      await setDoc(doc(FIREBASE_DB, 'Servicos', product?.id), prod);
      setProducts(prev => prev.map((item) => {
        if(item.id == id){
          item = {
            id,
            name,
            price,
            description: description ?? null,
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
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Produtos'));

        if(querySnapshot.empty){
          setIsLoading(false);
          return;
        }

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
            description : data.descricao,
            imagePath: imagePath ?? null,
            imageUrl: url ?? null
          };

        });
        const services = await Promise.all(servicesPromises);
        setProducts(services);
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
      <Text style={{alignSelf: 'center', marginBottom: 16}} weight='700' size={24}>Produtos</Text>
      {isLoading ?
        (
          <CenteredContainer>
            <ActivityIndicator size='large'  />
          </CenteredContainer>
        ) : ( products.length === 0 ? (
          <CenteredContainer>
            <Text size={24} weight='600' color='#666'>Nenhum produto</Text>
            <Text size={24} weight='600' color='#666'>Adicione Produtos</Text>
            <Text size={24} weight='600' color='#666'> no botão abaixo</Text>
          </CenteredContainer>
        ) :
          <FlatList
            data={products}
            keyExtractor={(service) => service.id}
            ItemSeparatorComponent={Separetor}
            contentContainerStyle={{paddingBottom: 70}}
            showsVerticalScrollIndicator={false}
            renderItem={({item: product}) => (
              <ServiceContainer>
                {product.imageUrl !== null && !undefined && <Image source={{ uri: product.imageUrl }}/>}
                <InfoContainer>
                  <Text weight='600'>{product.name}</Text>
                  <Text size={14} >{product.description}</Text>
                  <Text size={14} color='#666'>{formatCurrency(product.price)}</Text>
                </InfoContainer>
                <EditContainer>
                  <EditService
                    onPress={() => handleEditServiceModal(product)}
                  >
                    <AntDesign name='edit' size={24} color='#43c6ac'/>
                  </EditService>
                  <DeleteService
                    onPress={() => handleDelete(product.id)}
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
        Adicionar produto +
      </Button>

      <CreateProductModal
        visible={productModalVisible}
        cancelEditProduct={cancelEditProduct}
        closeModal={handleCloseModal}
        createProduct={handleCreateProduct}
        editProduct={handleEditProduct}
        product={product}
      />
      <DeleteProductModal
        id={deleteId}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteProduct}
        visible={deleteModalVisible}
      />
    </Container>
  );
}
