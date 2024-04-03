import { useURL } from 'expo-linking';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Header from '../components/Header';
import { AppContextProvider } from '../contexts/AppContextProvider';
import FirebaseFactory from '../services/firebase/FirebaseFactory';
import '../utils/i18n';
import theme from '../theme';

export default function Layout() {
  const pathname = usePathname();
  const linkingUrl = useURL();
  const router = useRouter();

  useEffect(() => {
    if (linkingUrl && linkingUrl.includes('/firebaseauth/link')) {
      router.push('/login?fromRecaptcha=true');
    }
  }, [linkingUrl]);

  useEffect(() => {
    if (__DEV__) {
      try {
        // FirebaseFactory.setupEmulators();
      } catch (error) {
        console.log('emulator error', error);
      }
    }
    const setupFirebaseAppCheck = async () => {
      console.log('setupFirebaseAppCheck');
      await FirebaseFactory.appCheckInit();
    };
    setupFirebaseAppCheck();
    FirebaseFactory.analyticsInit();
  }, []);

  useEffect(() => {
    const logScreenView = async () => {
      console.log('pathname', pathname);
      try {
        await FirebaseFactory.analyticsLogPageView(pathname);
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
