import styled from 'styled-components/native';

export const ServiceContainer = styled.View`
  flex-direction: row;
  margin: 0 24px;
  border-radius: 8px;
  background-color: #f5f5f5;
  flex: 1;
  padding: 8px;
  box-shadow: 8px 2px 1px rgba(0,0,0,1);
  elevation: 3;
`;

export const InfoContainer = styled.View`
  /* flex-direction: row; */
  align-items: stretch;
  margin-left: 16px;
  flex: 1;
`;

export const AddToCartButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

export const Separetor = styled.View`
  width: 100%;
  margin: 16px;
`;

export const Image = styled.Image`
  width: 128px;
  height: 96px;
  border-radius: 8px;
`;
