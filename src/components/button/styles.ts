import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  background: ${({disabled}) => disabled? '#999' : '#f1731f'};
  border-radius: 48px;
  padding: 14px 24px;
  align-items: center;
  justify-content: center;
`;



