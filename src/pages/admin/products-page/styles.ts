import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
  padding: 20px;
  background-color: #fdf1e3;
`;

export const ServiceContainer = styled.View`
  /* border: 1px solid orange; */
  /* border-radius: 8px; */
  padding: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 96px;
`;

export const InfoContainer = styled.View`
  flex: 1;
  gap: 8px;
`;

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
`;


export const EditService = styled.TouchableOpacity``;

export const DeleteService = styled.TouchableOpacity``;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Photo = styled.TouchableOpacity`
  margin-top: 24px;
  border: 1px solid black;
  padding: 12px;
  height: 500px;
`;

export const Teste = styled.View`
  height: 500px;
  width: 100%;
`;
