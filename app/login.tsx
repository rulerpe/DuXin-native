import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { CountryPicker, CountryItem } from 'react-native-country-codes-picker';

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
    countryCode,
    countryCodeChange,
  } = useLogin();
  const { t } = useTranslation();
  const { fromRecaptcha } = useGlobalSearchParams();
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCountrySelected = (item: CountryItem) => {
    countryCodeChange(item.dial_code);
    setShowCountryPicker(false);
  };

  useEffect(() => {
    if (!fromRecaptcha) {
      resetStates();
    }
    setRecaptchaVerifier();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.loginPageWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {!otpSent ? (
          <View style={styles.iputsWrapper}>
            {Platform.OS === 'web' && <div id="recaptcha-container"></div>}
            <TextComponent style={styles.loginInstruction}>{t('signinPhoneNumber')}</TextComponent>

            <View style={styles.phoneNumberInputRow}>
              <View style={styles.countryCode}>
                <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
                  <TextComponent>{countryCode}</TextComponent>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="7021234567"
                placeholderTextColor="rgba(136, 136, 136, 0.5)"
                style={[styles.inputField, error ? styles.inputError : {}, styles.phoneNumberInput]}
                value={phoneNumber}
                onChangeText={handleInputChange}
                inputMode="tel"
                onSubmitEditing={handlePhoneNumberSubmit} // Triggered when the user presses the submit button on the keyboard
                enterKeyHint="done"
                maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}
              />
            </View>

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
      <CountryPicker
        lang="en"
        initialState={countryCode}
        searchMessage={t('countryPickerSearchMessage')}
        show={showCountryPicker}
        pickerButtonOnPress={handleCountrySelected}
        onBackdropPress={() => setShowCountryPicker(false)}
        style={{
          modal: { height: 500 },
        }}
      />
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
  phoneNumberInputRow: {
    flexDirection: 'row',
  },
  phoneNumberInput: {
    flex: 7 / 9,
  },
  countryCode: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2 / 9,
  },
});
