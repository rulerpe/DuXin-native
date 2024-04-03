import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

import ButtonComponent from '../components/ButtonComponent';
import TextComponent, { defaultMaxFontSizeMultiplier } from '../components/TextComponent';
import { useLogin } from '../contexts/LoginContext';
import theme from '../theme';

export default function LoginPage() {
  const {
    phoneNumber,
    otp,
    error,
    isLoading,
    otpSent,
    handleInputChange,
    handleOtpSubmitManully,
    handlePhoneNumberSubmit,
    resetStates,
    setRecaptchaVerifier,
  } = useLogin();
  const { fromRecaptcha } = useGlobalSearchParams();

  useEffect(() => {
    console.log('fromRecaptcha', fromRecaptcha);
    if (!fromRecaptcha) {
      resetStates();
    }
    setRecaptchaVerifier();
  }, []);
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={styles.loginPageWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {!otpSent ? (
          <View style={styles.iputsWrapper}>
            {Platform.OS === 'web' && <div id="recaptcha-container"></div>}
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
              onSubmitEditing={handleOtpSubmitManully} // Triggered when the user presses the submit button on the keyboard
              enterKeyHint="done"
              maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}
              textContentType="oneTimeCode" // for iOS SMS AutoFill
            />
            {error ? <TextComponent style={styles.errorMessage}>{error}</TextComponent> : null}
            <ButtonComponent
              label="submitOTP"
              onPress={handleOtpSubmitManully}
              isLoading={isLoading}
            />
          </View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginPageWrapper: {
    paddingHorizontal: 15,
    width: '100%',
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
