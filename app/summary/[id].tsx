import { ScrollView, StyleSheet } from 'react-native';
import SummaryDetail from '../../components/SummaryDetail';
import { useLocalSearchParams } from 'expo-router';

export default function SummaryPage() {
  const { title, body, action } = useLocalSearchParams<{
    title: string;
    body: string;
    action: string;
  }>();
  return (
    <ScrollView style={styles.summaryWrapper}>
      {title && body && action && (
        <SummaryDetail
          summary={{
            title: title,
            body: body,
            action: action,
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryWrapper: {
    paddingHorizontal: 15,
  },
});
