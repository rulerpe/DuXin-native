import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { UserProvider } from '../contexts/UserContext';
import '../utils/i18n';
import theme from '../theme';

export default function Layout() {
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
