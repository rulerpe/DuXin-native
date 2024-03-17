import analytics from '@react-native-firebase/analytics';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Header from '../components/Header';
import { UserProvider } from '../contexts/UserContext';
import '../utils/i18n';
import theme from '../theme';

export default function Layout() {
  const pathname = usePathname();
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
    <UserProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.layout}>
          <Header />
          <View style={styles.contentContainer}>
            <Slot />
          </View>
          <StatusBar style="dark" />
          <Toast />
        </View>
      </SafeAreaView>
    </UserProvider>
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
