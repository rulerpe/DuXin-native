import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../theme';
import TextComponent from '../components/TextComponent';

interface ButtonComponentProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ButtonComponent({
  label,
  onPress,
  isLoading = false,
  size = 'large',
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
      textAlign: 'center',
    },
  });
  return (
    <Pressable style={styles.buttonWrapper} onPress={handlePress}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.secondaryText} />
      ) : (
        <TextComponent style={dynamicStyles.buttonLabel}>{label}</TextComponent>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
    minHeight: 60,
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondaryText,
    lineHeight: 1,
  },
});
