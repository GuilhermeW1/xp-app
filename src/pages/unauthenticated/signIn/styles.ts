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
  padding: 14px 24px;
  background: ${({disabled}) => disabled? '#999' : '#43c6ac'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  border-radius: 48px;
  gap: 16px;
`;

export const CreateAccountButton = styled.TouchableOpacity``;

export const EmailTextInput = styled.TextInput`
  border: 1px solid #43c6ac;
  width: 350px;
  padding: 8px;
  border-radius: 8px;

`;


export const PasswordTextInput = styled.TextInput`
  flex: 1;
  border-radius: 8px;
`;


export const LoginFormContainer = styled.View`
  gap: 16px;
  align-items: center;
`;

export const PasswordContainer = styled.View`
  flex-direction: row;
  border: 1px solid #43c6ac;
  border-radius: 8px;
  padding: 8px;

  align-items: center;
  justify-content: center;
  width: 350px;
`;

export const ToggleVisible = styled.TouchableOpacity``;

export const BackgroundImage = styled.ImageBackground`
  height: 200px;
  width: 200px;
`;
