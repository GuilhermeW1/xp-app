import styled from 'styled-components/native';

export const Overlay = styled.View`
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 20px;
`;

export const ModalBody = styled.View`
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
  gap: 16px;
  margin: 20px 0;
  width: 100%;
`;

export const ModalHeader = styled.View`
  height: 40px;
  align-items: center;
`;

export const NameInput = styled.TextInput`
  border: 1px solid orange;
  border-radius: 8px;
  padding: 8px;

`;

export const TimeInput = styled.TextInput`
  border: 1px solid orange;
  border-radius: 8px;
  padding: 8px;

`;

export const ValueInput = styled.TextInput`
  border: 1px solid orange;
  border-radius: 8px;
  padding: 8px;

`;

export const CreateServiceButton = styled.TouchableOpacity`
  align-self: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background: orange;
  border: 1px solid orange;
  width: 110px;
`;

export const CancelServiceButton = styled.TouchableOpacity`
  border: 1px solid orange;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid red;
`;

export const CloseModal = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;

`;

export const ModalOptionsSave = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

