import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

export type SummaryDetailType = {
  title: string;
  body: string;
  action: string;
};
export interface SummaryDetailProps {
  summary: SummaryDetailType;
}

export default function SummaryDetail({ summary }: SummaryDetailProps) {
  return (
    <View style={styles.summaryDetailWrapper}>
      <Text style={styles.label}>Title</Text>
      <Text style={styles.content}>{summary.title}</Text>
      <Text style={styles.label}>Summary</Text>
      <Text style={styles.content}>{summary.body}</Text>
      <Text style={styles.label}>Suggested action</Text>
      <Text style={styles.content}>{summary.action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryDetailWrapper: {
    alignItems: "center",
  },
  label: {
    paddingTop: 25,
    paddingBottom: 15,
    fontSize: theme.font.large,
    fontWeight: "bold",
  },
  content: { fontSize: theme.font.large },
});
