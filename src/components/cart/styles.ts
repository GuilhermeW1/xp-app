import styled from 'styled-components/native';

export const Item = styled.View`
  padding: 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ServiceInfo = styled.View`
  gap: 8px;
  flex-direction: row;
`;

export const InfoContainer = styled.View`
  gap: 8px;
`;

export const Actions = styled.TouchableOpacity`
`;

export const Info = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const QuantityCoitaner = styled.View`
  min-width: 15px;
  margin-left: 12px;
`;

export const Summary = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SummaryInfo = styled.View`
  margin-right: 32px;
  flex: 1;
`;

export const Image = styled.Image`
  width: 48px;
  height: 40px;
  border-radius: 8px;
`;
