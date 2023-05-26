import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex:1;
  background-color: #fdf1e3;
  padding: 24px;
`;


export const ServiceContainer = styled.View`
  flex-direction: row;
  height: 96px;
`;

export const InfoContainer = styled.View`
  flex: 1;
  margin-left: 16px;
  justify-content: space-around;
`;

export const InfoSeparetor = styled.View``;

export const EditContainer = styled.View`
  align-items: flex-end;
  gap: 8px;
  height: 100%;
  justify-content: space-around;
`;

export const Separetor = styled.View`
  width:100%;
  height: 1px;
  background: orange;
  margin: 16px 0;
`;

export const EditService = styled.TouchableOpacity``;

export const DeleteService = styled.TouchableOpacity``;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Image = styled.Image`
  height: 96px;
  width: 128px;
  border-radius: 8px;
`;
