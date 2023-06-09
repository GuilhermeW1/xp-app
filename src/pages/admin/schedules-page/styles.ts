import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const LogoutButton = styled.TouchableOpacity``;

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  padding: 24px 24px 0;
  flex: 1;
  background-color: #fff;

`;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ScheduleItem = styled.View`
  background-color: #f5f5f5	;
  /* justify-content: center; */
  border-radius: 8px;
  box-shadow: 8px 2px 1px rgba(0,0,0, 1);
  elevation: 3;
  gap: 8px;
  height: 100px;
  padding: 16px;
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
  margin-bottom: 16px;
`;

export const MenuContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 24px;
`;

export const OptionButton = styled.TouchableOpacity`
  background-color: #c173e6;
  padding: 8px;
  border-radius: 8px;
`;
