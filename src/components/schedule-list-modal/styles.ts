import styled from 'styled-components/native';

export const Overlay = styled.View`
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 24px 24px;
`;

export const ModalBody = styled.View`
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
  gap: 16px;
  margin: 24px 0px;
  width: 100%;
`;

export const CloseButton = styled.TouchableOpacity``;


export const ScheduleItem = styled.View`
  gap: 8px;
  border-radius: 8px;
  background-color: #f5f5f5;
  /* flex: 1; */
  padding: 8px;
  box-shadow: 8px 2px 1px rgba(0,0,0,1);
  elevation: 3;
`;

export const ServicesList = styled.View`
  max-height: 20px;
  flex-direction: row;
  gap: 8px;

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
  margin-bottom: 8px;
`;

export const CloseModal = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
`;
