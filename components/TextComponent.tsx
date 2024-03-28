import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

import theme from '../theme';

export const defaultMaxFontSizeMultiplier = 1.5;

export default function TextComponent({ style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      style={[styles.textDefaultStyle, style]}
      maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}>
      {props.children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  textDefaultStyle: {
    fontSize: theme.font.large,
  },
});
