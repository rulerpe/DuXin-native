// import auth from '@react-native-firebase/auth';
import { router, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import SummaryList from '../components/SummaryList';
import TextComponent from '../components/TextComponent';
import { useUser } from '../contexts/UserContext';
import FirebaseFactory from '../services/firebase/FirebaseFactory';

export default function AccountPage() {
  const { user } = useUser();
  const { t } = useTranslation();

  const onLogout = async () => {
    try {
      await FirebaseFactory.authSignOut();
      Toast.show({
        type: 'success',
        text1: t('logoutSuccess'),
      });
      router.navigate('/');
    } catch (error) {
      console.log('logout error', error);
      Toast.show({
        type: 'error',
        text1: t('logoutFailed'),
      });
    }
  };

  return (
    <View style={styles.accountPageWrapper}>
      <View style={styles.accountInfoWrapper}>
        <View style={styles.accountInfoRow}>
          <Link href={{ pathname: '/account-detail' }}>
            <View style={styles.accountInfoLabel}>
              <TextComponent allowFontScaling={false}>{t('phoneNumberLabel')}:</TextComponent>
            </View>
            <View>
              <TextComponent allowFontScaling={false} style={styles.accountInfoPhoneNumber}>
                {user?.phoneNumber}
              </TextComponent>
            </View>{' '}
          </Link>
        </View>
        <View style={styles.logoutBtn}>
          <ButtonComponent label="logoutButton" onPress={onLogout} size="medium" />
        </View>
      </View>
      <View style={styles.summaryListWrapper}>
        <SummaryList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountPageWrapper: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  accountInfoWrapper: {
    flex: 1 / 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  accountInfoRow: {},
  accountInfoLabel: {},
  accountInfoPhoneNumber: { fontWeight: 'bold' },
  logoutBtn: { paddingVertical: 5 },
  summaryListWrapper: {
    flex: 5 / 6,
  },
});
