import { router, Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import LanguageSelector from '../components/LanguageSelector';
import TextComponent from '../components/TextComponent';
import { usePhoto } from '../contexts/PhotoContext';
import { useUser } from '../contexts/UserContext';
import FirebaseFactory from '../services/firebase/FirebaseFactory';
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
        await FirebaseFactory.updateUserLanguage(user.id, language);
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
      <View style={styles.linksRow}>
        <Link style={styles.link} href="/privacy-policy">
          <Text>{t('privacyPolicyLink')}</Text>
        </Link>
        <Link style={styles.link} href="/support">
          <Text>{t('supportLink')}</Text>
        </Link>
      </View>
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
  link: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
