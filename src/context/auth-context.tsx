import { useState } from 'react';
import { UserCredential } from 'firebase/auth';
import { createContext, useContext } from 'react';
import { createUser, isAdmin, signIn } from '../services/auth';
import { FIREBASE_DB } from '../../firebaseConfig';
// import { ref, onValue } from 'firebase/database';
// import { FIREBASE_DB } from '../../firebaseConfig';

interface AuthContextProviderType {
  children: React.ReactNode;
}

interface UserType {
  id: string;
  email: string | null;
  emailVerified: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserType | null;
  signInWithEmailAndPassword: (email: string, password: string) => void;
  createNewUser: (email: string, password: string) => void
  signOut(): void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({children}: AuthContextProviderType) {
  const [user, setUser] = useState<UserType | null>(null);

  const signInWithEmailAndPassword = async(email: string, password: string) => {
    const {user} = await signIn({email, password});

    const userAdmin = await isAdmin(user.uid);

    setUser({
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: userAdmin,
    });
  };

  const createNewUser = async(email: string, password: string) => {
    const {user} = await createUser({email, password});

    setUser({
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: false
    });

  };

  function signOut (){
    setUser(null);
  }

  return(
    <AuthContext.Provider value={{signInWithEmailAndPassword, user, createNewUser, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(){
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('trying to use auth context out a auth context provider');
  }

  return context;
}
