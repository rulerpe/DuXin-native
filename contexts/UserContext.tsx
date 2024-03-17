import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { i18n } = useTranslation();

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged triggered');
    if (user) {
      const userMeta = await firestore().collection('users').doc(user.uid).get();
      console.log('userMeta', userMeta.data());
      if (userMeta.exists) {
        const userMetaData = userMeta.data() as User;
        setUser(userMetaData);
        i18n.changeLanguage(userMetaData.language);
      } else {
        const userMetaObj = {
          id: user.uid,
          createdAt: user.metadata.creationTime || '',
          lastSignInTime: user.metadata.lastSignInTime || '',
          phoneNumber: user.phoneNumber || '',
          language: i18n.language,
          userType: 'TEMP' as 'TEMP' | 'USER',
        };
        await firestore().collection('users').doc(user.uid).set(userMetaObj);
        console.log('set data');
        setUser(userMetaObj);
      }
    } else {
      await auth().signInAnonymously();
    }
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must used in a UserProvider');
  }
  return context;
};
