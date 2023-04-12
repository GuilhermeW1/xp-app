import React, { useState } from 'react';
import { Text } from '../../../components/Text';
import { Container, EmailTextInput, LoginFormContainer, PasswordTextInput, SignInButton } from './styles';
import { useAuth } from '../../../context/auth-context';
import { Link } from '@react-navigation/native';

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [invalidCredentials, setInvalidCredentials] = useState<null | boolean>(null);

  const {createNewUser} = useAuth();

  async function handleCreateAccount(){
    await createNewUser(email, password);
  }

  return (
    <Container>
      <Text size={24} weight='600' opacity={0.7}>Crie sua conta</Text>

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
        <PasswordTextInput
          placeholder='confirme a senha'
          secureTextEntry
          value={verifyPassword}
          onChangeText={setVerifyPassword}
        />
        <SignInButton
          onPress={handleCreateAccount}
        >
          <Text weight='600' size={24} opacity={0.7}>Criar Conta</Text>
        </SignInButton>
      </LoginFormContainer>

      <Link to={{screen: 'SignIn'}}>
        <Text style={{textDecorationLine: 'underline'}} size={16} color='blue'>Ja tenho uma conta</Text>
      </Link>
    </Container>
  );
};

export default CreateAccount;
