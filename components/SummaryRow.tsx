import { StyleSheet, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { Link } from 'expo-router';
import { Summary } from '../types';
import { useTranslation } from 'react-i18next';
import theme from '../theme';

interface SummaryRowProp {
  summary: Summary;
  onDelete: (id: number) => void;
  rowNumber: number;
}

export default function SummaryRow({ summary, onDelete, rowNumber }: SummaryRowProp) {
  const { t, i18n } = useTranslation();
  const isDarkRowClass = (rowNumber: number): boolean => {
    return rowNumber % 2 === 0;
  };
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };
  return (
    <View style={[styles.rowWrapper, isDarkRowClass(rowNumber) ? styles.darkRow : {}]}>
      <Link
        href={{
          pathname: '/summary/[id]',
          params: {
            id: summary.id,
            title: summary.translated_title,
            body: summary.translated_body,
            action: summary.translated_action,
          },
        }}>
        <View>
          <TextComponent>{formatDate(summary.created_at)}</TextComponent>
          <TextComponent>{summary.translated_title}</TextComponent>
        </View>
      </Link>
      <View>
        <ButtonComponent
          label={t('deleteSummaryButton')}
          onPress={() => onDelete(summary.id)}
          size="medium"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    padding: 15,
    gap: 10,
  },
  darkRow: {
    backgroundColor: theme.colors.secondaryBackground,
  },
});
