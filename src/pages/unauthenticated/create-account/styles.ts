import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 24px;

`;

export const SignInButton = styled.TouchableOpacity`
  flex-direction: row;
  color: orange;
  background-color: #FF6000;
  display: flex;
  padding: 16px 24px;
  align-items: center;
  justify-content: center;
  width: 250px;
  border-radius: 48px;
  gap: 16px;
`;

export const CreateAccountButton = styled.TouchableOpacity``;

export const EmailTextInput = styled.TextInput`
  border: 1px solid orange;
  width: 350px;
  padding: 8px;
  border-radius: 8px;
`;


export const PasswordTextInput = styled.TextInput`
  border: 1px solid orange;
  width: 350px;
  padding: 8px;
  border-radius: 8px;
`;


export const LoginFormContainer = styled.View`
  gap: 16px;
  align-items: center;
`;
