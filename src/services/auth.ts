import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { addDoc, collection, DocumentData, getDoc, getDocs, query, where } from 'firebase/firestore';
// import { push, ref } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';

interface createUserProps {
  email: string;
  password: string;
}

interface signInPops {
  email: string;
  password: string;
}

interface isAdminProps {
  isAdmin: boolean;
  userId: string;
}

export async function createUser({email, password}: createUserProps): Promise<UserCredential>{
  try{
    const user = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const userId = user.user.uid;

    await addDoc(collection(FIREBASE_DB,'Users'), {
      userId,
      isAdmin: false,
    });
    return user;
  }catch(error){
    throw new Error('Erro ao criar a conta' + error);
  }
}


export async function signIn({email, password}: signInPops) {
  try{
    const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    return user;
  }catch(error){
    console.log(error);
    throw new Error('Erro ao logar');
  }
}

export async function isAdmin(userId: string): Promise<boolean>{
  const data: DocumentData = [] ;
  const userIdQuery = query(collection(FIREBASE_DB, 'Users'), where('userId', '==', userId));
  const result = await getDocs(userIdQuery);
  result.forEach((doc) => {
    const dataQuery = doc.data();
    data.push(dataQuery);
  });

  if(data[0].isAdmin){
    return true;
  }
  return false;
}
