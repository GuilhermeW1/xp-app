import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fdf1e3;

`;

export const CalendarContainer = styled.View`
  margin-top: 20px
`;

export const OptionsContaier = styled.View`
  flex: 1;
  margin: 20px
  align-items: center;
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
  margin: 20px 20px 50px;
  border-radius: 8px;
  padding: 12px;
`;





