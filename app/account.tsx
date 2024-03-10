import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
import { useTranslation } from 'react-i18next';
import ApiService from '../services/ApiService';
import { useUser } from '../contexts/UserContext';
import SummaryList from '../components/SummaryList';
import Toast from 'react-native-toast-message';

export default function AccountPage() {
  const { user, setUser } = useUser();
  const { t, i18n } = useTranslation();

  const onLogout = async () => {
    try {
      await ApiService.logout();
      // Create a temp user account right after logout
      const tempUserResponse = await ApiService.createTempUser(i18n.language);
      setUser(tempUserResponse.user);
      Toast.show({
        type: 'success',
        text1: t('logoutSuccess'),
      });
      router.navigate('/');
    } catch (error) {}
  };

  return (
    <View style={styles.accountPageWrapper}>
      <View style={styles.accountInfoWrapper}>
        <View style={styles.accountInfoRow}>
          <View style={styles.accountInfoLabel}>
            <TextComponent allowFontScaling={false}>{t('phoneNumberLabel')}:</TextComponent>
          </View>
          <View>
            <TextComponent allowFontScaling={false} style={styles.accountInfoPhoneNumber}>
              {user?.phone_number}
            </TextComponent>
          </View>
        </View>
        <View style={styles.logoutBtn}>
          <ButtonComponent label={t('logoutButton')} onPress={onLogout} size="medium" />
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
