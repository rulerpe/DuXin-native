import { router } from 'expo-router';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useState, createContext, useContext, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';

import FirebaseFactory from '../services/firebase/FirebaseFactory';

interface LoginContextType {
  phoneNumber: string;
  otp: string;
  error: string;
  isLoading: boolean;
  otpSent: boolean;
  handleInputChange: (text: string) => void;
  handlePhoneNumberSubmit: () => Promise<void>;
  handleOtpSubmitManully: () => Promise<void>;
  resetStates: () => void;
  setRecaptchaVerifier: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);

  const resetStates = () => {
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
    setVerificationId('');
    setError('');
    setIsLoading(false);
    setConfirm(null);
    setCaptchaVerified(false);
  };

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

  const handlePhoneNumberSubmit = async () => {
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith('+1')) {
      formattedPhoneNumber = `+1${formattedPhoneNumber}`;
    }
    if (!validatePhoneNumber(formattedPhoneNumber)) {
      setError(t('invalidPhoneNumber'));
      return;
    }
    try {
      setIsLoading(true);
      if (Platform.OS === 'web') {
        await verifyPhoneNumberWeb(formattedPhoneNumber);
      } else {
        await verifyPhoneNumberMobile(formattedPhoneNumber);
      }
    } catch {
      setError(t('submitPhoneNumberFailed'));
    } finally {
      setIsLoading(false);
      Keyboard.dismiss();
    }
  };

  const handleOtpSubmitManully = async () => {
    if (!validateOtp(otp)) {
      setError(t('invalidOTP'));
      return;
    }
    try {
      setIsLoading(true);
      if (Platform.OS === 'web') {
        await verifyOtpCodeWeb();
      } else {
        await verifyOtpCodeMobile();
      }
    } catch (error) {
      console.log('submit otp failed', error);
      setError(t('submitOTPFailed'));
    } finally {
      setIsLoading(false);
      Keyboard.dismiss();
    }
  };

  const verifyPhoneNumberMobile = async (formattedPhoneNumber: string) => {
    await FirebaseFactory.authVerifyPhoneNumberMobile(formattedPhoneNumber).on(
      'state_changed',
      async (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state) {
          case FirebaseFactory.authPhoneAuthStateMobile.CODE_SENT:
            console.log('code sent');
            setVerificationId(phoneAuthSnapshot.verificationId);
            setOtpSent(true);
            setIsLoading(false);
            break;
          case FirebaseFactory.authPhoneAuthStateMobile.AUTO_VERIFIED:
            const { verificationId, code } = phoneAuthSnapshot;
            if (verificationId && code) {
              const credential = FirebaseFactory.authPhoneAuthProviderMobile.credential(
                verificationId,
                code,
              );
              await FirebaseFactory.authsSignInWithCredentialMobile(credential);
              Toast.show({
                type: 'success',
                text1: t('loginSuccess'),
              });
              router.navigate('/');
            }
            console.log('Phone number automatically verified');
            break;
          case FirebaseFactory.authPhoneAuthStateMobile.AUTO_VERIFY_TIMEOUT:
            // Auto verification timed out, ask user to enter the code manually
            console.log('Verification timeout, code: ', phoneAuthSnapshot.code);
            setError(t('submitPhoneNumberFailed'));
            setIsLoading(false);
            break;
          case FirebaseFactory.authPhoneAuthStateMobile.ERROR:
            console.log('Verification error', phoneAuthSnapshot.error);
            setError(t('submitPhoneNumberFailed'));
            setIsLoading(false);
            break;
        }
      },
    );
  };

  const verifyOtpCodeMobile = async () => {
    const credential = FirebaseFactory.authPhoneAuthProviderMobile.credential(verificationId, otp);
    await FirebaseFactory.authsSignInWithCredentialMobile(credential);
    Toast.show({
      type: 'success',
      text1: t('loginSuccess'),
    });
    router.navigate('/');
  };

  // for web
  const setRecaptchaVerifier = () => {
    if (Platform.OS === 'web' && FirebaseFactory.firebaseweb) {
      recaptchaVerifier.current = new RecaptchaVerifier(
        FirebaseFactory.firebaseweb.auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            setCaptchaVerified(true);
          },
        },
      );
    }
  };

  const verifyPhoneNumberWeb = async (formattedPhoneNumber: string) => {
    if (FirebaseFactory.firebaseweb && recaptchaVerifier.current) {
      console.log('handlePhoneNumberSubmit');
      const confirmation = await signInWithPhoneNumber(
        FirebaseFactory.firebaseweb.auth,
        formattedPhoneNumber,
        recaptchaVerifier.current,
      );
      setConfirm(confirmation);
      setOtpSent(true);
    }
  };

  const verifyOtpCodeWeb = async () => {
    await confirm?.confirm(otp);
    Toast.show({
      type: 'success',
      text1: t('loginSuccess'),
    });
    router.navigate('/');
  };

  return (
    <LoginContext.Provider
      value={{
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
      }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must used in a LoginProvider');
  }
  return context;
};
