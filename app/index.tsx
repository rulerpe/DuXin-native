import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import LanguageSelector from '../components/LanguageSelector';
import TextComponent from '../components/TextComponent';
import { usePhoto } from '../contexts/PhotoContext';
import { useUser } from '../contexts/UserContext';
import theme from '../theme';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { takePhoto } = usePhoto();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUser();

  const onTakePhoto = async () => {
    await takePhoto();
    router.navigate('/summary-generate');
  };

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
      <ButtonComponent label="navigateToCamera" onPress={onTakePhoto} isLoading={isLoading} />
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
