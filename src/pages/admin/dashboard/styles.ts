import styled from 'styled-components/native';

export const Container = styled.View`
  flex:1;
  background-color: #fdf1e3;
`;

export const CreateService = styled.TouchableOpacity`
  margin: 16px 20px 0;
  border-radius: 8px;
  padding: 12px;
  align-items: center;
  justify-content: center;
  background: #FF6000;
`;

export const SignOutButton = styled.TouchableOpacity`

`;

export const ServiceContainer = styled.View`
  margin: 20px;
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
  margin: 0 24px;
`;


export const EditService = styled.TouchableOpacity``;

export const DeleteService = styled.TouchableOpacity``;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
