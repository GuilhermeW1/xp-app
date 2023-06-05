import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  border: 2px solid ${({disabled}) => disabled? '#999' : '#43c6ac'};
  border-radius: 48px;
  padding: 12px 22px; //thats because the 1px of the border
  align-items: center;
  justify-content: center;
`;



