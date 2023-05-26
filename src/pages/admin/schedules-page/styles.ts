import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const LogoutButton = styled.TouchableOpacity``;

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  padding: 24px 24px 0;
  flex: 1;
  background-color: #fdf1e3;

`;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ScheduleItem = styled.View`
  gap: 8px;
`;

export const ServicesList = styled.View`
  max-height: 20px;
  flex-direction: row;
  gap: 8px;
  flex: 1;
`;

export const TimeContainer = styled.View`
  gap: 4px;
  `;

export const InfoContainer =  styled.View`
  gap: 4px;
`;

export const ItemContainer = styled.View`
justify-content: space-between;
  flex-direction: row;
`;

export const Separetor = styled.View`
  width:100%;
  height: 1px;
  background: orange;
  margin-bottom: 8px;
`;

export const MenuContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 16px;
`;

export const OptionButton = styled.TouchableOpacity``;
