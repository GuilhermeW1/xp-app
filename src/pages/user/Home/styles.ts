import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Container = styled.SafeAreaView`
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
  background-color: #fdf1e3;
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

export const UserContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

export const SelectDay = styled.TouchableOpacity`
  border: 2px solid #FF6000;
  border-radius: 30px;
  padding: 8px 16px;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const SelectDayContainer = styled.View`
  align-items: center;
  gap: 8px;
`;

export const SelectHourContainer = styled.View`
  margin-top: 24px;
  gap: 8px;
  align-items: center;
`;

export const SelectHour = styled.TouchableOpacity`
  border: 2px solid ${({disabled}) => disabled ? '#666' : '#FF6000'};
  border-radius: 30px;
  padding: 8px 16px;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const Footer = styled.View`
  min-height: 110px;
  background-color: #fafafa;
`;

export const FooterContainer = styled.SafeAreaView`
  margin: 24px;
`;

export const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;

export const ScheduleContainer = styled.View`
  margin-top: 24px;
  flex: 1;
  justify-content: space-around;
`;

export const CenteredContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const BackButton = styled.TouchableOpacity`
`;

export const Spacer = styled.View``;

export const Menu = styled.View`
  flex: 1;
  margin: 16px 24px;
  min-height: 30px;
  max-height: 30px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 16px;

`;

export const MenuItem = styled.TouchableOpacity`
  background-color: #f1731f;
  flex: 1;
  border-radius: 48px;
  padding: 6px 0;
  align-items: center;
`;
