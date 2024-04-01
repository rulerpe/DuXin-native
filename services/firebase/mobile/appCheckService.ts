import appCheck from '@react-native-firebase/app-check';

export const setupAppCheck = async (): Promise<void> => {
  try {
    const rnfbProvider = appCheck().newReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? 'debug' : 'playIntegrity',
        debugToken: 'A7E5034E-F482-4C93-9D63-646B795EBE0B',
      },
      apple: {
        provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
        debugToken: '540BEE80-9D3A-4E6C-A832-9A3A4681DC39',
      },
      web: {
        provider: 'reCaptchaV3',
        siteKey: 'unknown',
      },
    });
    await appCheck().initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    console.log('initializeAppCheck');
    const { token } = await appCheck().getToken(true);
    if (token.length > 0) {
      console.log('AppCheck verification passed');
    }
  } catch (error) {
    console.log('AppCheck verification failed', error);
  }
};
