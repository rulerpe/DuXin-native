import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

interface IconButtonProps {
  icon: any;
  onPress: () => void;
  size?: number;
}

export default function IconButton({ icon, onPress, size = 24 }: IconButtonProps) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <FontAwesome5 name={icon} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
