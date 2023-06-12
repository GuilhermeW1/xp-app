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
  border: 1px solid #43c6ac;
  border-radius: 8px;
  padding: 8px;
`;

export const TimeInput = styled.TextInput`
  border: 1px solid #43c6ac;
  border-radius: 8px;
  padding: 8px;
`;

export const ValueInput = styled.TextInput`
  border: 1px solid #43c6ac;
  border-radius: 8px;
  padding: 8px;
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

export const ImagePickerContainer = styled.View`
  min-height: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Image = styled.Image`
  height: 98px;
  width: 126px;
  border-radius: 8px;
`;

export const SelectImageButton = styled.TouchableOpacity`
  align-items: center;
`;

export const Separetor = styled.View``;
