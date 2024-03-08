import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import theme from "../theme";

interface ButtonComponentProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: "small" | "medium" | "large";
}

export default function ButtonComponent({
  label,
  onPress,
  isLoading = false,
  size = "medium",
}: ButtonComponentProps) {
  const handlePress = () => {
    if (!isLoading) {
      onPress();
    }
  };
  const dynamicStyles = StyleSheet.create({
    buttonLabel: {
      fontSize: theme.font[size],
      color: theme.colors.secondaryText,
    },
  });
  return (
    <Pressable style={styles.buttonWrapper} onPress={handlePress}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.secondaryText} />
      ) : (
        <Text style={dynamicStyles.buttonLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 60,
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondaryText,
  },
});
