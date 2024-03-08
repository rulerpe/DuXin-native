import { Text, View, Pressable, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import theme from "../theme";
import IconButton from "../components/IconButton";

export default function Header() {
  const onBack = () => {
    console.log("on back", router.canGoBack());
    if (router.canGoBack()) {
      router.back();
    }
  };
  const onUser = () => {
    console.log("on user");
    router.navigate("/account");
    // or login page depend on login user type
  };
  return (
    <View style={styles.headerWrapper}>
      <IconButton icon="chevron-left" onPress={onBack} />
      <Link href="/">
        <Text style={styles.welcomeText}>Duxin</Text>
      </Link>
      <IconButton icon="user-alt" onPress={onUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    backgroundColor: theme.colors.secondaryBackground,
    color: theme.colors.primary,
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: theme.font.large,
    fontWeight: "bold",
  },
});
