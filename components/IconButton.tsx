import { Pressable, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface IconButtonProps {
  icon: any;
  onPress: () => void;
}

export default function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <FontAwesome5 name={icon} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
