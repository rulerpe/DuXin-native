import analytics from '@react-native-firebase/analytics';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';

import TextComponent from '../components/TextComponent';
import theme from '../theme';

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
  const { t } = useTranslation();
  const handlePress = async () => {
    if (!isLoading) {
      onPress();
      const formatLabel = label.replace(' ', '_');
      await analytics().logEvent(formatLabel, {
        button_name: formatLabel,
      });
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
        <TextComponent style={dynamicStyles.buttonLabel}>{t(label)}</TextComponent>
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
