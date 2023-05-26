import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
  background-color: '#fdf1e3';
  padding: 24px;
`;


export const UserInfoContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 150px;
  gap: 24px;
`;

export const ActionsList = styled.View`
  margin-top: 32px;
  gap: 24px;
`;

export const Footer = styled.View`
  margin: 0 24px 24px;
  ;
`;

export const FooterContainer = styled.SafeAreaView``;


export const AlertContainer = styled.TouchableOpacity`
  padding: 8px 0;
  align-self: center;
  margin-bottom: 24px;
  gap: 4px;
  align-items: center;
  background-color: #98D8AA;
  border-radius: 48px;
  width: 300px;
`;
