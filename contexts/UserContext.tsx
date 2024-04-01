import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import FirebaseFactory from '../services/firebase/FirebaseFactory';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { t, i18n } = useTranslation();

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    try {
      if (user) {
        // first check if user is exists
        await user.reload();
        const userMetaData = (await FirebaseFactory.getUserMeta(user.uid)) as User;
        if (userMetaData) {
          setUser(userMetaData);
          i18n.changeLanguage(userMetaData.language);
          FirebaseFactory.authSetLanguageCode(userMetaData.language);
        } else {
          const userMetaObj = {
            id: user.uid,
            createdAt: user.metadata.creationTime || '',
            lastSignInTime: user.metadata.lastSignInTime || '',
            phoneNumber: user.phoneNumber || '',
            language: i18n.language,
            userType: user.isAnonymous ? 'TEMP' : ('USER' as 'TEMP' | 'USER'),
          };
          await FirebaseFactory.setUserMeta(user.uid, userMetaObj);
          FirebaseFactory.authSetLanguageCode(i18n.language);
          setUser(userMetaObj);
        }
      } else {
        await FirebaseFactory.signInAnonymously();
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        await FirebaseFactory.signInAnonymously();
      } else {
        console.log('Error getting user info', error);
        Toast.show({
          type: 'error',
          text1: t('networkError'),
        });
      }
    }
  };
  useEffect(() => {
    const subscriber = FirebaseFactory.onAuthStateChanged(onAuthStateChanged);
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
