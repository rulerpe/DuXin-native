import appCheck from '@react-native-firebase/app-check';
import analytics from '@react-native-firebase/analytics';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Header from '../components/Header';
import { AppContextProvider } from '../contexts/AppContextProvider';
import '../utils/i18n';
import theme from '../theme';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    const setupFirebaseAppCheck = async () => {
      console.log('setupFirebaseAppCheck');
      try {
        const rnfbProvider = appCheck().newReactNativeFirebaseAppCheckProvider();
        rnfbProvider.configure({
          android: {
            provider: __DEV__ ? 'debug' : 'playIntegrity',
            debugToken: 'A7E5034E-F482-4C93-9D63-646B795EBE0B',
          },
          apple: {
            provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
            debugToken: 'A7E5034E-F482-4C93-9D63-646B795EBE0B',
          },
          web: {
            provider: 'reCaptchaV3',
            siteKey: 'unknown',
          },
        });
        console.log('rnfbProvider', rnfbProvider);
        await appCheck().initializeAppCheck({
          provider: rnfbProvider,
          isTokenAutoRefreshEnabled: true,
        });

        console.log('initializeAppCheck');
        const { token } = await appCheck().getToken(true);
        console.log('appcheck token', token);
        if (token.length > 0) {
          console.log('AppCheck verification passed');
        }
      } catch (error) {
        console.log('AppCheck verification failed', error);
      }
    };
    setupFirebaseAppCheck();
    if (!__DEV__) {
      // Enable Firebase Analytics for production
      analytics().setAnalyticsCollectionEnabled(true);
    } else {
      // Disable Firebase Analytics for development
      analytics().setAnalyticsCollectionEnabled(false);
    }
  }, []);

  useEffect(() => {
    const logScreenView = async () => {
      console.log('pathname', pathname);
      try {
        await analytics().logScreenView({
          screen_name: pathname,
          screen_class: pathname,
        });
      } catch (err) {
        console.error(err);
      }
    };
    logScreenView();
  }, [pathname]);

  return (
    <AppContextProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.layout}>
          <Header />
          <View style={styles.contentContainer}>
            <Slot />
          </View>
          <Toast />
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: theme.font.medium,
  },
});
