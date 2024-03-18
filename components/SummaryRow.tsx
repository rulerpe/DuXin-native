import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import theme from '../theme';
import { Summary } from '../types';

interface SummaryRowProp {
  summary: Summary;
  onDelete: (id: string) => void;
  rowNumber: number;
}

export default function SummaryRow({ summary, onDelete, rowNumber }: SummaryRowProp) {
  const isDarkRowClass = (rowNumber: number): boolean => {
    return rowNumber % 2 === 0;
  };
  const formatDate = (createdAt: Date): string => {
    const date = new Date(createdAt);
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
            title: summary.summaryTitle,
            body: summary.summaryBody,
            action: summary.summaryAction,
          },
        }}>
        <View>
          <TextComponent>{formatDate(summary.createdAt)}</TextComponent>
          <TextComponent>{summary.summaryTitle}</TextComponent>
        </View>
      </Link>
      <View>
        <ButtonComponent
          label="deleteSummaryButton"
          onPress={() => {
            if (summary.id) onDelete(summary.id);
          }}
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
