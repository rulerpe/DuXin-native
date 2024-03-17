import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TextInput, Keyboard, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from '../components/ButtonComponent';
import TextComponent, { defaultMaxFontSizeMultiplier } from '../components/TextComponent';
import theme from '../theme';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // Validation functions
  const validatePhoneNumber = (number: string): boolean =>
    number.startsWith('+1') && number.length === 12;
  const validateOtp = (otp: string): boolean => otp.length === 6;

  const handleInputChange = (text: string) => {
    setError('');
    if (confirm) {
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
      console.log('handlePhoneNumberSubmit');
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirm(confirmation);
      Keyboard.dismiss();
    } catch {
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
      await confirm?.confirm(otp);
      Toast.show({
        type: 'success',
        text1: t('loginSuccess'),
      });
      router.navigate('/');
      Keyboard.dismiss();
    } catch (error) {
      console.log('submit otp failed', error);
      setError(t('submitOTPFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.loginPageWrapper} contentContainerStyle={styles.contentContainer}>
      {!confirm ? (
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
            label="submitPhoneNumber"
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
          <ButtonComponent label="submitOTP" onPress={handleOtpSubmit} isLoading={isLoading} />
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
