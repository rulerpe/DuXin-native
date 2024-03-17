import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import LanguageSelector from '../components/LanguageSelector';
import TextComponent from '../components/TextComponent';
import { useUser } from '../contexts/UserContext';
import { useTakePhoto } from '../hooks/useTakePhoto';
import ApiService from '../services/ApiService';
import theme from '../theme';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { image, takePhoto } = useTakePhoto();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUser();

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        try {
          setIsLoading(true);
          const formData = new FormData();
          //@ts-ignore
          formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' });
          await ApiService.uploadImage(formData);
          router.navigate('/summary-generate');
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    uploadImage();
  }, [image]);

  const handleLanguageChange = async (language: string) => {
    try {
      if (user) {
        setIsLoading(true);
        await firestore().collection('users').doc(user.id).update({ language });
        i18n.changeLanguage(language);
        setUser({ ...user, language });
      }
    } catch (error) {
      console.error('Change language failed', error);
      Toast.show({
        type: 'error',
        text1: t('changeLanguageFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.homePage} contentContainerStyle={styles.contentContainer}>
      <TextComponent style={styles.welcomeText}>{t('welcomText')}</TextComponent>
      <ButtonComponent label="navigateToCamera" onPress={takePhoto} isLoading={isLoading} />
      <LanguageSelector onLanguageChange={handleLanguageChange} isDisabled={isLoading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homePage: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: theme.font.large,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});
