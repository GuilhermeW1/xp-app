import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
`;


export const Body = styled.View``;


export const Footer = styled.View`
  min-height: 110px;
`;


export const FooterContainer = styled.SafeAreaView`
  margin: 24px;
`;
