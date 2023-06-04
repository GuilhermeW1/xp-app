import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

const isAndroid = Platform.OS === 'android';


export const Container = styled.SafeAreaView`
  display: flex;
  margin-top: ${isAndroid ? `${StatusBar.currentHeight}px` : '0px'};
  flex: 1;
  flex-direction: column;
  background-color: #fff;
  gap: 10px;
`;

export const CalendarContainer = styled.View`
  margin: 16px 20px 0px;
`;

export const OptionsContaier = styled.View`
  flex: 1;
  margin: 0 20px 20px;
  align-items: stretch;
  justify-content: space-around;
`;


export const CheckBoxContainer = styled.TouchableOpacity`
  margin-bottom: 8px;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const Check = styled.View`
  height: 20px;
  width: 20px;
  border: 1px solid orange;
`;

export const SendConfigurations = styled.TouchableOpacity`
  background: orange;
  display: flex;
  align-items: center;
  /* margin: 20px 20px 50px; */
  /* margin: 0 20px; */
  border-radius: 8px;
  padding: 12px;
`;

export const CenteredContainer = styled.View`
  justify-content: center;
  height: 300px;
  align-items: center;
  ;
`;

export const PikerContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ServiceHourSelection = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex:1;
`;

export const ServiceContainer = styled.View`
  flex: 1;
`;

export const MorningContainer = styled.TouchableOpacity`
  gap: 8px;
`;

export const AfternoonContainer = styled.TouchableOpacity`
  gap: 8px;
`;
