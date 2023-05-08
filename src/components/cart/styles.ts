import styled from 'styled-components/native';

export const Item = styled.View`
  padding: 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ServiceInfo = styled.View`
  gap: 8px;
`;

export const InfoContainer = styled.View`
  gap: 8px;
  flex-direction: row;
`;

export const Actions = styled.TouchableOpacity`

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

export const CancelButton = styled.TouchableOpacity`
  border: 1px solid #FF6000;
  border-radius: 48px;
  padding: 14px 24px;
  align-items: center;
  justify-content: center;
`;
