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
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [previousAnonymousUID, setPreviousAnonymousUID] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateUserMetaData = async () => {
      try {
        if (authUser) {
          // Extend the user token. if token is not valid this throw error to the catch block
          await authUser.getIdToken(true);
          if (authUser.isAnonymous) {
            setPreviousAnonymousUID(authUser.uid);
          }
          const userMetaData = (await FirebaseFactory.getUserMeta(authUser.uid)) as User;
          if (userMetaData) {
            setUser(userMetaData);
            i18n.changeLanguage(userMetaData.language);
            FirebaseFactory.authSetLanguageCode(userMetaData.language);
          } else {
            let userMetaObj: User = {
              id: authUser.uid,
              createdAt: authUser.metadata.creationTime || '',
              lastSignInTime: authUser.metadata.lastSignInTime || '',
              phoneNumber: authUser.phoneNumber || '',
              language: i18n.language,
              userType: authUser.isAnonymous ? 'TEMP' : ('USER' as 'TEMP' | 'USER'),
              totalSummaries: 0,
            };
            if (!authUser.isAnonymous) {
              userMetaObj = { ...userMetaObj, previousAnonymousUID };
            }
            // await FirebaseFactory.setUserMeta(authUser.uid, userMetaObj);
            await FirebaseFactory.saveUserMeta(userMetaObj);
            FirebaseFactory.authSetLanguageCode(i18n.language);
            setUser(userMetaObj);
          }
        } else {
          await FirebaseFactory.signInAnonymously();
        }
      } catch (error: any) {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/internal-error' ||
          error.code === 'auth/invalid-refresh'
        ) {
          // if user has been deleted from firebase, sign the invalid user out.
          await FirebaseFactory.authSignOut();
        } else {
          console.log('Error getting user info', error, authUser);
          Toast.show({
            type: 'error',
            text1: t('networkError'),
          });
        }
      }
    };
    updateUserMetaData();
  }, [authUser]);

  const onAuthStateChanged = async (authuser: FirebaseAuthTypes.User | null) => {
    setAuthUser(authuser);
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
