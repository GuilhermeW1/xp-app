import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
`;


export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 24px 24px 0;
`;

export const CancelOrder = styled.TouchableOpacity``;

export const Body = styled.View`
  flex: 1;
`;

export const ServiceContainer = styled.View`
  margin: 16px 24px;
  gap: 8px;
`;

export const InfoContainer = styled.View`
  flex-direction: row;
  gap: 16px;
`;


export const Footer = styled.View`
  min-height: 110px;
`;

export const AddToCartButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

export const FooterContainer = styled.SafeAreaView`
  margin: 24px;
`;


