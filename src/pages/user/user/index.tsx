import { useEffect, useState } from 'react';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/button';
import { SecondaryButton } from '../../../components/secondary-button';
import { useAuth } from '../../../context/auth-context';
import { ActionsList, AlertContainer, Container, Footer, FooterContainer, UserInfoContainer } from './styles';
import {EvilIcons} from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../firebaseConfig';
import { ScheduleListModal } from '../../../components/schedule-list-modal';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/Rotues';
import { StackNavigationProp } from '@react-navigation/stack';

type UserScreen = StackNavigationProp<RootStackParamList, 'HomeUser'>;

export function User(){
  const {user, signOut} = useAuth();
  const navigate = useNavigation<UserScreen>();

  const [scheduleHour, setScheduleHour] = useState<boolean>(false);
  const [scheduleListModalVisible, setScheduleListModalVisible] = useState<boolean>(false);
  const [historyModalVisibility, setHistoryModalVisibility] = useState<boolean>(false);

  function closeHistoryModal(){
    setHistoryModalVisibility(false);
  }

  function closeScheduleListModal(){
    setScheduleListModalVisible(false);
  }

  useEffect(() => {
    const getData = async() => {
      const date = new Date();
      const dbQuery = query(collection(FIREBASE_DB ,'Agendamento') ,where('userId', '==', user?.id), where('date', '>', date));
      const querySnap = await getDocs(dbQuery);
      if(querySnap.empty){
        setScheduleHour(false);
      }else{
        setScheduleHour(true);
      }
    };

    getData();
  }, [user?.id]);

  return(
    <>
      <Container>
        <UserInfoContainer>
          <Text><EvilIcons name="user" size={64} color="#666" /></Text>
          <Text size={24} weight='600' color='#666' >{user?.email}</Text>
        </UserInfoContainer>

        <ActionsList>
          {scheduleHour && (
            <AlertContainer
              onPress={() => setScheduleListModalVisible(true)}
            >
              <Text color='#666'>Voce tem horario(s) marcado(s)</Text>
              <Text color='#666' size={14}>Clique para ver</Text>
            </AlertContainer>
          )}
          <Button onPress={() => navigate.navigate('HomeUser')}>
            Serviços e produtos
          </Button>
          <Button onPress={() => setScheduleListModalVisible(true)}>
            Meus Agendamentos
          </Button>
          <Button onPress={() => setHistoryModalVisibility(true)}>
            Ver historico
          </Button>
        </ActionsList>
      </Container>
      <FooterContainer>
        <Footer>
          <SecondaryButton
            onPress={signOut}
          >
          Logout
          </SecondaryButton>
        </Footer>
      </FooterContainer>
      <ScheduleListModal
        userId={user!.id}
        visible={scheduleListModalVisible}
        onClose={closeScheduleListModal}
      />
      <ScheduleListModal
        userId={user!.id}
        visible={historyModalVisibility}
        onClose={closeHistoryModal}
        history={true}
      />
    </>
  );
}
