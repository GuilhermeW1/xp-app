import styled from 'styled-components/native';

export const ServiceContainer = styled.View`
  margin: 0 24px;
  flex-direction: row;
`;

export const InfoContainer = styled.View`
  /* flex-direction: row; */
  margin-left: 16px;
  gap: 16px;
`;

export const AddToCartButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

export const Separetor = styled.View`
  width: 100%;
  height: 1px;
  background: orange;
  margin: 24px 24px 24px 24px;
`;

export const Image = styled.Image`
  width: 128px;
  height: 96px;
  border-radius: 8px;
`;
