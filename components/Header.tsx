import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import IconButton from '../components/IconButton';
import TextComponent from '../components/TextComponent';
import { useUser } from '../contexts/UserContext';
import theme from '../theme';

export default function Header() {
  const { user } = useUser();
  const { t } = useTranslation();

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  const onUser = () => {
    if (user && user.userType === 'USER') {
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
