import { useState, useEffect } from 'react';
import { View, StyleSheet, PixelRatio } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

import { defaultMaxFontSizeMultiplier } from '../components/TextComponent';
import { useUser } from '../contexts/UserContext';
import theme from '../theme';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  isDisabled?: boolean;
}
export default function LanguageSelector({
  isDisabled = false,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(user?.language || 'en');
  const languageOptions: ItemType<any>[] = [
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: '한국어', value: 'ko' },
    { label: 'Русский', value: 'ru' },
    { label: 'Tiếng Việt', value: 'vi' },
    { label: 'Filipino', value: 'fil' },
  ];

  useEffect(() => {
    setValue(user?.language || 'en');
  }, [user?.language]);
  const handleLanguageChange = (selectedItem: ItemType<any>) => {
    if (onLanguageChange && selectedItem) {
      onLanguageChange(selectedItem.value);
    }
  };
  return (
    <View style={styles.dropdownWrapper}>
      <DropDownPicker
        open={open}
        value={value}
        items={languageOptions}
        setOpen={setOpen}
        setValue={setValue}
        disabled={isDisabled}
        labelProps={{ maxFontSizeMultiplier: defaultMaxFontSizeMultiplier }}
        listMode="SCROLLVIEW"
        itemProps={{
          style: {
            height: 50 * PixelRatio.getFontScale(),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}
        maxHeight={350}
        onSelectItem={handleLanguageChange}
        textStyle={styles.dropdownTextStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  dropdownTextStyle: {
    fontSize: theme.font.large,
    textAlign: 'center',
  },
});
