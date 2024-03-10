import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { isAxiosError } from 'axios';
import ApiService from '../services/ApiService';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import theme from '../theme';
import IconButton from '../components/IconButton';
import TextComponent from '../components/TextComponent';

export default function Header() {
  const { user, setUser } = useUser();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const getUserResponse = await ApiService.fetchCurrentUser();
        setUser(getUserResponse.user);
        i18n.changeLanguage(getUserResponse.user.language);
      } catch (error) {
        // if no authuraized user if found, create a temp user account
        if (isAxiosError(error) && error.response?.status === 401) {
          try {
            const tempUserResponse = await ApiService.createTempUser(i18n.language);
            setUser(tempUserResponse.user);
          } catch (error) {
            console.error('Failed to create temp user', error);
          }
        } else {
          console.error('Failed to fetch user', error);
        }
      }
    };
    getUser();
  }, []);

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  const onUser = () => {
    if (user && user.user_type === 'USER') {
      router.navigate('/account');
    } else {
      router.navigate('/login');
    }
  };
  return (
    <View style={styles.headerWrapper}>
      <IconButton icon="chevron-left" onPress={onBack} />
      <Link href="/">
        <TextComponent style={styles.welcomeText}>{t('appName')}</TextComponent>
      </Link>
      <IconButton icon="user-alt" onPress={onUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondaryBackground,
    color: theme.colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: theme.font.large,
    fontWeight: 'bold',
  },
});
