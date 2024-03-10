import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import theme from '../theme';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
import LanguageSelector from '../components/LanguageSelector';
import { useTakePhoto } from '../hooks/useTakePhoto';
import { useTranslation } from 'react-i18next';
import ApiService from '../services/ApiService';
import { useUser } from '../contexts/UserContext';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { image, takePhoto } = useTakePhoto();
  const { t, i18n } = useTranslation();
  const { setUser } = useUser();

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
      setIsLoading(true);
      const response = await ApiService.updateUserLanguage(language);
      i18n.changeLanguage(language);
      setUser(response.user);
    } catch (error) {
      console.error('Change language failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.homePage} contentContainerStyle={styles.contentContainer}>
      <TextComponent style={styles.welcomeText}>{t('welcomText')}</TextComponent>
      <ButtonComponent label={t('navigateToCamera')} onPress={takePhoto} isLoading={isLoading} />
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
