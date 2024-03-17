import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Summary } from '../types';
import ApiService from '../services/ApiService';
import ButtonComponent from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import SummaryRow from './SummaryRow';

export default function SummaryList() {
  const [page, setPage] = useState<number>(1);
  const [summaryList, setSummaryList] = useState<Summary[]>([]);
  const { t } = useTranslation();
  // const { showNotification } = useNotification();
  const [isGetMoreLoading, setIsGetMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    const getNextSummaries = async () => {
      setIsGetMoreLoading(true);
      const summaries = await ApiService.fetchSummaries(page);
      setSummaryList((preSummaryList) => [...preSummaryList, ...summaries]);
      setIsGetMoreLoading(false);
    };
    getNextSummaries();
  }, [page]);

  const onDelete = async (summaryId: number) => {
    await ApiService.deleteSummary(summaryId);
    const updatedList = summaryList.filter((summary) => {
      return summary.id !== summaryId;
    });
    setSummaryList(updatedList);
    // showNotification({ message: 'deleteSummarySuccess', type: 'success' });
  };
  const onMore = () => {
    setPage((prePage) => prePage + 1);
  };

  return (
    <FlatList
      data={summaryList}
      renderItem={({ item, index }) => (
        <SummaryRow summary={item} onDelete={onDelete} rowNumber={index} />
      )}
      keyExtractor={(summary, index) => `${summary.id}${index}`}
      ListFooterComponent={() => (
        <ButtonComponent label="moreSummaryButton" onPress={onMore} isLoading={isGetMoreLoading} />
      )}
      ListFooterComponentStyle={styles.listFooter}
    />
  );
}

const styles = StyleSheet.create({
  darkRow: {},
  listFooter: {
    padding: 15,
  },
});
