import React, { useState } from 'react';
import { Text } from '../../../components/Text';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Container, EmailTextInput, LoginFormContainer, PasswordContainer, PasswordTextInput, SignInButton, ToggleVisible } from './styles';
import { useAuth } from '../../../context/auth-context';
import { ActivityIndicator } from 'react-native';
import { Link } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('gui.a.weiss@hotmail.com');
  const [password, setPassword] = useState<string>('weiss1234');
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState<null | boolean>(null);
  const [passwordVisibility, setPaswordVisibility] = useState<boolean>(true);

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
        <PasswordContainer>

          <PasswordTextInput
            placeholder='senha'
            secureTextEntry={passwordVisibility}
            value={password}
            onChangeText={setPassword}
          />
          <ToggleVisible
            onPress={() => setPaswordVisibility(!passwordVisibility)}
          >
            <Text>
              {passwordVisibility ? <Ionicons name="eye-off-outline" size={24} color="orange" /> :
                <Ionicons name="eye-outline" size={24} color="orange" />
              }
            </Text>
          </ToggleVisible>
        </PasswordContainer>
        <SignInButton
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator size='small' color='#FF6000'/> : (
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
