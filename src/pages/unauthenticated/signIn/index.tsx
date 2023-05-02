import React, { useState } from 'react';
import { Text } from '../../../components/Text';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Container, CreateAccountButton, EmailTextInput, LoginFormContainer, PasswordTextInput, SignInButton } from './styles';
import { useAuth } from '../../../context/auth-context';
import { ActivityIndicator } from 'react-native';
import { Link } from '@react-navigation/native';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('teste123@gmail.com');
  const [password, setPassword] = useState<string>('12345678');
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState<null | boolean>(null);

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

  return (
    <Container>
      <Text size={24} weight='600' opacity={0.7}>Bem vindo</Text>

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
        />
        <PasswordTextInput
          placeholder='senha'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <SignInButton
          onPress={handleSignIn}
        >
          {isLoading ? <ActivityIndicator size={24}/> : (
            <>
              <Text weight='400' size={24} color='#fff'>Entrar</Text>
              <SimpleLineIcons name='login' size={24} color='#fff'/>
            </>
          )}
        </SignInButton>
      </LoginFormContainer>

      <Link to={{screen: 'CreateAccount'}}>
        <Text style={{textDecorationLine: 'underline'}} size={16} color='blue'>Criar conta</Text>
      </Link>
    </Container>
  );
};

export default SignIn;
