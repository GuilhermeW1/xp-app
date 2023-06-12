import React, { useState } from 'react';
import { Text } from '../../../components/Text';
import { Container, EmailTextInput, LoginFormContainer, PasswordTextInput, SignInButton } from './styles';
import { useAuth } from '../../../context/auth-context';
import { Link } from '@react-navigation/native';
import { emailValidate, passwordValidate } from './validations';

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const {createNewUser} = useAuth();

  async function handleCreateAccount(){
    let validEmail = false;
    let validPassword = false;
    if(emailValidate(email)){
      validEmail = true;
    }else {
      setEmailError(true);
      return;
    }

    const passworResult = passwordValidate(password, verifyPassword);

    if(passworResult == true){
      validPassword = true;
    }else if(typeof passworResult == 'string'){
      setPasswordError(passworResult);
    }
    if(validPassword && validEmail){
      alert('ciando conta');
      // await createNewUser(email, password);
    }
  }

  return (
    <Container>

      <Text size={24} weight='600' opacity={0.7}>Crie sua conta</Text>

      <LoginFormContainer>
        {emailError ?
          <Text color='red' weight='400' size={16}>Formato de email incorreto</Text>
          :
          null
        }
        {passwordError ?
          <Text color='red' weight='400' size={16}>{ passwordError}</Text>
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
          <Text weight='600' size={16} color='#fff'>Criar Conta</Text>
        </SignInButton>
      </LoginFormContainer>

      <Link to={{screen: 'SignIn'}}>
        <Text style={{textDecorationLine: 'underline'}} size={14} color='#191645'>Ja tenho uma conta</Text>
      </Link>
    </Container>
  );
};

export default CreateAccount;
