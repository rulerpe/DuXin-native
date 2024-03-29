import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import TextComponent from '../components/TextComponent';
import theme from '../theme';

export type SummaryDetailType = {
  title: string;
  body: string;
  action: string;
};
export interface SummaryDetailProps {
  summary: SummaryDetailType;
}

export default function SummaryDetail({ summary }: SummaryDetailProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.summaryDetailWrapper}>
      <TextComponent style={styles.label}>{t('summaryTitle')}</TextComponent>
      <TextComponent style={styles.content}>{summary.title}</TextComponent>
      <TextComponent style={styles.label}>{t('summaryBody')}</TextComponent>
      <TextComponent style={styles.content}>{summary.body}</TextComponent>
      <TextComponent style={styles.label}>{t('summaryAction')}</TextComponent>
      <TextComponent style={styles.content}>{summary.action}</TextComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryDetailWrapper: {
    alignItems: 'center',
  },
  label: {
    paddingTop: 25,
    paddingBottom: 15,
    fontSize: theme.font.large,
    fontWeight: 'bold',
  },
  content: { fontSize: theme.font.large },
});
