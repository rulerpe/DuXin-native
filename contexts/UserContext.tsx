import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { t, i18n } = useTranslation();
  if (__DEV__) {
    auth().useEmulator('http://localhost:9099');
    firestore().useEmulator('localhost', 8080);
    functions().useEmulator('localhost', 5001);
  }

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged triggered');
    try {
      if (user) {
        const userMeta = await firestore().collection('users').doc(user.uid).get();
        console.log('userMeta', userMeta.data());
        // save user token for request to firebase function.
        // if (Platform.OS !== 'web') {
        //   const userToken = await user?.getIdToken();
        //   await SecureStore.setItemAsync('auth_token', userToken);
        // }
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
            userType: user.isAnonymous ? 'TEMP' : ('USER' as 'TEMP' | 'USER'),
          };
          await firestore().collection('users').doc(user.uid).set(userMetaObj);
          console.log('set data');
          setUser(userMetaObj);
        }
      } else {
        await auth().signInAnonymously();
      }
    } catch (error) {
      console.log('Error getting user info', error);
      Toast.show({
        type: 'error',
        text1: t('networkError'),
      });
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
