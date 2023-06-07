import React, { useEffect, useState } from 'react';
import { Text } from '../../../components/Text';
import { SimpleLineIcons } from '@expo/vector-icons';
import { BackgroundImage, Container, EmailTextInput, LoginFormContainer, PasswordContainer, PasswordTextInput, SignInButton, ToggleVisible } from './styles';
import { useAuth } from '../../../context/auth-context';
import { ActivityIndicator, ImageBackground } from 'react-native';
import { Link } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, ref } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../../../firebaseConfig';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState<null | boolean>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState('');

  const {signInWithEmailAndPassword} = useAuth();

  async function handleSignIn(){
    setIsLoading(true);
    if(!email || !password) {
      setIsLoading(false);
      return;
    }

    setInvalidCredentials(false);
    try{
      await signInWithEmailAndPassword(email, password);
      setIsLoading(false);
    }catch(error){
      setInvalidCredentials(true);
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    (async() => {
      const imageRef = ref(FIREBASE_STORAGE, 'app-images/diogoapp.png');
      try{
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      }catch(error){
        console.log(error);
      }
    })();

  },[]);

  return (
    <Container>
      {imageUrl && <BackgroundImage source={{uri: imageUrl}} resizeMode='cover'/>}
      <Text size={24} weight='600' opacity={0.7} >Bem vindo</Text>
      <LoginFormContainer>
        {invalidCredentials ?
          <Text color='red' weight='400' size={16}>Usuario ou Senha incorretos</Text>
          :
          null
        }
        <EmailTextInput
          placeholder='e-mail'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        <PasswordContainer>

          <PasswordTextInput
            placeholder='senha'
            secureTextEntry={passwordVisibility}
            value={password}
            onChangeText={setPassword}
          />
          <ToggleVisible
            onPress={() => setPasswordVisibility(!passwordVisibility)}
          >
            <Text>
              {passwordVisibility ? <Ionicons name="eye-off-outline" size={24} color="#43c6ac"/> :
                <Ionicons name="eye-outline" size={24} color="orange" />
              }
            </Text>
          </ToggleVisible>
        </PasswordContainer>
        <SignInButton
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator size='small' color='#43c6ac'/> : (
            <>
              <Text weight='600' color='#fff' size={16}>Entrar</Text>
              <SimpleLineIcons name='login' size={24} color='#fff'/>
            </>
          )}
        </SignInButton>
      </LoginFormContainer>

      <Link to={{screen: 'CreateAccount'}}>
        <Text style={{textDecorationLine: 'underline'}} size={14} color='#191645'>Criar conta</Text>
      </Link>
    </Container>
  );
};

export default SignIn;
