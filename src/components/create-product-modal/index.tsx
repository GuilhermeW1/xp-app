import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { Text } from '../Text';
import { ModalBody, NameInput, Overlay, TimeInput, ValueInput, CloseModal, ModalOptionsSave, ModalHeader, ImagePickerContainer, Image, SelectImageButton, Separetor } from './styles';
import {AntDesign} from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../button';
import { SecondaryButton } from '../secondary-button';
import * as ImagePicker from 'expo-image-picker';
import { CreateProduct, IProduct, UpdateProduct } from '../../pages/admin/products-page';

interface ModalProps {
  visible: boolean,
  closeModal: () => void,
  product: IProduct | null,
  cancelEditProduct: () => void,
  createProduct: (service: CreateProduct) => Promise<void>
  editProduct: (service: UpdateProduct) => Promise<void>
}

export function CreateProductModal({visible, closeModal, product, cancelEditProduct, createProduct, editProduct}: ModalProps){
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>('');

  async function handleCreateProduct(){
    setIsLoading(true);
    await createProduct({name: productName, price: parseFloat(productPrice), description: productDescription, imageUrl: imageUrl});
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setImageUrl('');
    setIsLoading(false);
    closeModal();
  }

  async function handleEditService(){
    if(!product) return;
    setIsLoading(true);
    await editProduct({id: product.id, name: productName, price: parseFloat(productPrice), description: productDescription, imageUrl});
    setProductName('');
    setProductPrice('');
    setProductDescription('');
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
    if(product == null){
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setImageUrl('');
      return;
    }else {
      setProductName(product.name);
      setImageUrl(product?.imageUrl ?? null);
      setProductPrice(product.price.toString());
      setProductDescription(product.description ?? '');
    }
  }, [product]);

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
            {product? <Text weight='600'>Editar</Text> : <Text weight='600'>Criar serviço</Text>}
            <CloseModal
              onPress={closeModal}
            >
              <AntDesign name="closecircleo" size={30} color="red" />
            </CloseModal>
          </ModalHeader>
          <Text>Nome do produto</Text>
          <NameInput
            value={productName}
            onChangeText={setProductName}
            keyboardType='ascii-capable'
          />

          <Text>Descrição</Text>
          <TimeInput
            value={productDescription}
            onChangeText={setProductDescription}
            keyboardType='ascii-capable'
          />
          <Text>Valor do produto</Text>
          <ValueInput
            value={productPrice}
            onChangeText={setProductPrice}
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
          {isLoading? <ActivityIndicator size='large'/> : (product ? (
            <ModalOptionsSave>
              <Button
                onPress={cancelEditProduct}
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
                onPress={handleCreateProduct}
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
