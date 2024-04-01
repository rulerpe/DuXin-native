import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
import { useUser } from '../contexts/UserContext';
import FirebaseFactory from '../services/firebase/FirebaseFactory';

export default function AccountDetailPage() {
  const { user } = useUser();
  const { t } = useTranslation();

  const showConfirmationDialog = () => {
    if (Platform.OS === 'web') {
      showAlertWeb();
    } else {
      showAlertMobile();
    }
  };
  const showAlertMobile = () => {
    Alert.alert(
      t('deleteAccountAlertTitle'),
      t('deleteAccountAlertBody'),
      [
        {
          text: t('deleteAccountAlertCancelBtn'),
          onPress: () => console.log('Account deletion canceled.'),
          style: 'cancel',
        },
        { text: t('deleteAccountAlertDeleteBtn'), onPress: () => deleteAccount() },
      ],
      { cancelable: false },
    );
  };
  const showAlertWeb = () => {
    const confirmDelete = window.confirm(t('deleteAccountAlertBody'));
    if (confirmDelete) {
      deleteAccount();
    } else {
      console.log('Account deletion canceled.');
    }
  };

  const deleteAccount = async () => {
    console.log('delete account');
    try {
      await FirebaseFactory.authDeleteUser();
      Alert.alert(t('AccountDeletedAlertTitle'), t('AccountDeletedAlertBody'));
      router.navigate('/');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: t('AccountDeleteError'),
      });
    }
  };

  return (
    <View style={styles.accountDetailPageWrapper}>
      <View style={styles.accountInfoWrapper}>
        <View style={styles.accountInfoRow}>
          <View style={styles.accountInfoLabel}>
            <TextComponent allowFontScaling={false}>{t('accountLabel')}:</TextComponent>
          </View>
          <View>
            <TextComponent allowFontScaling={false} style={styles.accountInfoPhoneNumber}>
              {user?.phoneNumber}
            </TextComponent>
          </View>
        </View>
      </View>
      <View style={styles.accountDetailWrapper}>
        {/* future payment or subscription info */}
        <View>
          <ButtonComponent label="deleteAccountBtn" onPress={showConfirmationDialog} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountDetailPageWrapper: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 15,
  },
  accountInfoWrapper: {
    flex: 1 / 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  accountInfoRow: {
    flexDirection: 'column',
  },
  accountInfoLabel: {},
  accountInfoPhoneNumber: { fontWeight: 'bold' },
  logoutBtn: { paddingVertical: 5 },
  accountDetailWrapper: {
    flex: 5 / 6,
  },
});
