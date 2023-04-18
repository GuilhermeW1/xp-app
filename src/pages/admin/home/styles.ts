import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #fdf1e3;
  gap: 10px;
`;

export const CalendarContainer = styled.View`
  margin-top: 16px;
`;

export const OptionsContaier = styled.View`
  flex: 1;
  margin: 0 20px;
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

export const HorarioContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  /* margin: 0 20px; */
`;

export const HorarioBox = styled.View`
  justify-content: center;
  align-items: center;
`;

export const HoraStart = styled.TextInput`
  border: 1px solid black;
  width: 100px;
  border: 1px solid orange;

`;


