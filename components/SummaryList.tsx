import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import ButtonComponent from './ButtonComponent';
import SummaryRow from './SummaryRow';
import { useUser } from '../contexts/UserContext';
import { Summary } from '../types';

export default function SummaryList() {
  const [summaryList, setSummaryList] = useState<Summary[]>([]);
  const { t } = useTranslation();
  const { user } = useUser();
  const [noMore, setNoMore] = useState<boolean>(false);
  const [isGetMoreLoading, setIsGetMoreLoading] = useState<boolean>(false);
  const pageSize = 10;
  let lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null;

  const fetchSummaries = async (
    cursor: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null,
  ) => {
    try {
      setIsGetMoreLoading(true);
      let query = firestore()
        .collection('summaries')
        .where('userId', '==', user?.id)
        .orderBy('createdAt', 'desc')
        .limit(pageSize);
      if (cursor) {
        query = query.startAfter(lastVisible);
      }

      const documentSnapshots = await query.get();
      lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1] || null;
      if (documentSnapshots.docs.length < 10) {
        setNoMore(true);
      }
      const summaries: Summary[] = documentSnapshots.docs.map((doc) => {
        const data = doc.data() as Summary;
        const createdAt = (data.createdAt as unknown as FirebaseFirestoreTypes.Timestamp).toDate();
        return { ...data, id: doc.id, createdAt } as Summary;
      });
      console.log('summary', summaries[0].createdAt);

      setSummaryList((preSummaryList) => [...preSummaryList, ...summaries]);
    } catch (error) {
      console.log('error fetching summaries', error);
      Toast.show({
        type: 'error',
        text1: t('fetchingSummariesFailed'),
      });
    } finally {
      setIsGetMoreLoading(false);
    }
  };
  useEffect(() => {
    fetchSummaries();
  }, []);

  const onDelete = async (summaryId: string) => {
    await firestore().collection('summaries').doc(summaryId).delete();
    const updatedList = summaryList.filter((summary) => {
      return summary.id !== summaryId;
    });
    setSummaryList(updatedList);
  };
  const onMore = async () => {
    await fetchSummaries(lastVisible);
  };

  return (
    <FlatList
      data={summaryList}
      renderItem={({ item, index }) => (
        <SummaryRow summary={item} onDelete={onDelete} rowNumber={index} />
      )}
      keyExtractor={(summary, index) => `${summary.id}${index}`}
      ListFooterComponent={() =>
        !noMore && (
          <ButtonComponent
            label="moreSummaryButton"
            onPress={onMore}
            isLoading={isGetMoreLoading}
          />
        )
      }
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
