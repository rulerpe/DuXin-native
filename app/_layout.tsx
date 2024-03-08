import { Slot } from "expo-router";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Pressable, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.layout}>
        <Header />
        <View style={styles.contentContainer}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
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
    justifyContent: "center",
    alignItems: "center",
  },
});
