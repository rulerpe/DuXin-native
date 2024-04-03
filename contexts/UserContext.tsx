import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import FirebaseFactory from '../services/firebase/FirebaseFactory';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  initializeUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { t, i18n } = useTranslation();

  const onAuthStateChanged = async (authuser: FirebaseAuthTypes.User | null) => {
    try {
      if (authuser) {
        // Extend the user token. if token is not valid this throw error to the catch block
        await authuser.getIdToken(true);
        const userMetaData = (await FirebaseFactory.getUserMeta(authuser.uid)) as User;
        if (userMetaData) {
          setUser(userMetaData);
          i18n.changeLanguage(userMetaData.language);
          FirebaseFactory.authSetLanguageCode(userMetaData.language);
        } else {
          const userMetaObj = {
            id: authuser.uid,
            createdAt: authuser.metadata.creationTime || '',
            lastSignInTime: authuser.metadata.lastSignInTime || '',
            phoneNumber: authuser.phoneNumber || '',
            language: i18n.language,
            userType: authuser.isAnonymous ? 'TEMP' : ('USER' as 'TEMP' | 'USER'),
          };
          await FirebaseFactory.setUserMeta(authuser.uid, userMetaObj);
          FirebaseFactory.authSetLanguageCode(i18n.language);
          setUser(userMetaObj);
        }
      } else {
        await FirebaseFactory.signInAnonymously();
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // if user has been deleted from firebase, sign the invalid user out.
        await FirebaseFactory.authSignOut();
      } else {
        console.log('Error getting user info', error);
        Toast.show({
          type: 'error',
          text1: t('networkError'),
        });
      }
    }
  };
  const initializeUser = () => {
    FirebaseFactory.onAuthStateChanged(onAuthStateChanged);
  };

  return (
    <UserContext.Provider value={{ user, setUser, initializeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must used in a UserProvider');
  }
  return context;
};
