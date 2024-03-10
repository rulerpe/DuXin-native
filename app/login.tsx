import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Keyboard, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent, { defaultMaxFontSizeMultiplier } from '../components/TextComponent';
import theme from '../theme';
import ApiService from '../services/ApiService';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

type SetStateAction = React.Dispatch<React.SetStateAction<string>>;

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUser();

  // Validation functions
  const validatePhoneNumber = (number: string): boolean =>
    number.startsWith('+1') && number.length === 12;
  const validateOtp = (otp: string): boolean => otp.length === 6;

  const handleInputChange = (text: string) => {
    setError('');
    if (otpSent) {
      setOtp(text);
    } else {
      setPhoneNumber(text);
    }
  };
  // Create new user, and trigger OTP verfication
  const handlePhoneNumberSubmit = async () => {
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith('+1')) {
      formattedPhoneNumber = `+1${formattedPhoneNumber}`;
    }
    if (!validatePhoneNumber(formattedPhoneNumber)) {
      setError(t('invalidPhoneNumber'));
      return;
    }
    setPhoneNumber(formattedPhoneNumber);

    try {
      setIsLoading(true);
      console.log('create user');
      await ApiService.createUser(formattedPhoneNumber, i18n.language);
      setOtpSent(true);
      Keyboard.dismiss();
    } catch (error) {
      setError(t('submitPhoneNumberFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // verify otp for new user account, if temp user was previously used
  // send the temp user id alone, to transfer history to new user account.
  const handleOtpSubmit = async () => {
    if (!validateOtp(otp)) {
      setError(t('invalidOTP'));
      return;
    }
    try {
      setIsLoading(true);
      const otpVerifyResponse = await ApiService.otpVerify(phoneNumber, otp, user);
      setUser(otpVerifyResponse.user);
      i18n.changeLanguage(otpVerifyResponse.user.language);
      Toast.show({
        type: 'success',
        text1: t('loginSuccess'),
      });
      router.navigate('/');
      Keyboard.dismiss();
    } catch (error) {
      setError(t('submitOTPFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.loginPageWrapper} contentContainerStyle={styles.contentContainer}>
      {!otpSent ? (
        <View style={styles.iputsWrapper}>
          <TextComponent style={styles.loginInstruction}>{t('signinPhoneNumber')}</TextComponent>
          <TextInput
            placeholder="(702)123-4567"
            placeholderTextColor="rgba(136, 136, 136, 0.5)"
            style={[styles.inputField, error ? styles.inputError : {}]}
            value={phoneNumber}
            onChangeText={handleInputChange}
            inputMode="tel"
            onSubmitEditing={handlePhoneNumberSubmit} // Triggered when the user presses the submit button on the keyboard
            enterKeyHint="done"
            maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}
          />
          {error ? <TextComponent style={styles.errorMessage}>{error}</TextComponent> : null}
          <ButtonComponent
            label={t('submitPhoneNumber')}
            onPress={handlePhoneNumberSubmit}
            isLoading={isLoading}
          />
        </View>
      ) : (
        <View style={styles.iputsWrapper}>
          <TextComponent style={styles.loginInstruction}>{t('signinOTP')}</TextComponent>
          <TextInput
            placeholder="123456"
            placeholderTextColor="rgba(136, 136, 136, 0.5)"
            style={[styles.inputField, error ? styles.inputError : {}]}
            value={otp}
            onChangeText={handleInputChange}
            inputMode="numeric"
            onSubmitEditing={handleOtpSubmit} // Triggered when the user presses the submit button on the keyboard
            enterKeyHint="done"
            maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}
          />
          {error ? <TextComponent style={styles.errorMessage}>{error}</TextComponent> : null}
          <ButtonComponent label={t('submitOTP')} onPress={handleOtpSubmit} isLoading={isLoading} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginPageWrapper: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginInstruction: {
    fontSize: theme.font.large,
    fontWeight: 'bold',
    marginVertical: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputField: {
    fontSize: theme.font.medium,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    borderRadius: 5,
    marginVertical: 10,
    height: 60,
    textAlign: 'center',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorMessage: {
    color: theme.colors.error,
    fontSize: theme.font.large,
    textAlign: 'center',
    marginBottom: 10,
  },
  iputsWrapper: {
    width: '100%',
    textAlign: 'center',
  },
});
