import React from 'react';
import { Text } from '../../../components/Text';
import { useAuth } from '../../../context/auth-context';
import { Container, LogoutButton } from './styles';

export function Clients(){
  const {signOut} = useAuth();
  return (
    <Container>
      <LogoutButton
        onPress={signOut}
      >
        <Text>Sign Out</Text>
      </LogoutButton>
      <Text>Clients page</Text>
    </Container>
  );
}
