import { StyleSheet, View, TouchableOpacity } from 'react-native';

import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import theme from '../theme';
import { Summary } from '../types';

interface SummaryRowProp {
  summary: Summary;
  onDelete: (id: string) => void;
  rowNumber: number;
  onPress: (summary: Summary) => void;
}

export default function SummaryRow({ summary, onDelete, rowNumber, onPress }: SummaryRowProp) {
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
      <TouchableOpacity onPress={() => onPress(summary)}>
        <View>
          <TextComponent>{formatDate(summary.createdAt)}</TextComponent>
          <TextComponent>{summary.summaryTitle}</TextComponent>
        </View>
      </TouchableOpacity>
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
