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
  height: 200px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  justify-content: space-between;
`;

export const CloseModal = styled.TouchableOpacity`


`;

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;



// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   picker: {
//     width: 80,
//   },
//   separator: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
