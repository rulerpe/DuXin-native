import functions from '@react-native-firebase/functions';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';

import ButtonComponent from '../components/ButtonComponent';
import SummaryDetail, { SummaryDetailProps } from '../components/SummaryDetail';
import TextComponent from '../components/TextComponent';
import { usePhoto } from '../contexts/PhotoContext';
import theme from '../theme';
import { Summary } from '../types';

export default function SummaryGeneratePage() {
  const { image, takePhoto } = usePhoto();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<Summary>();

  useEffect(() => {
    const processImage = async () => {
      if (image) {
        console.log('process Imgage');
        try {
          setIsLoading(true);
          const { data } = await functions().httpsCallable('getImageSummary')({
            image,
            language: i18n.language,
          });
          setSummary(data);
        } catch (error) {
          setHasError(true);
          console.log('error', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    processImage();
  }, [image]);

  const onTryAgain = () => {
    router.navigate('/');
  };

  const errorView = () => {
    return (
      <View>
        <TextComponent style={styles.errorMessage}>{t('summaryGeneratePageError')}</TextComponent>
        <View style={styles.photoButtonWrapper}>
          <ButtonComponent label="takePhotoAgain" onPress={onTryAgain} />
        </View>
      </View>
    );
  };
  const progressBarView = () => {
    return (
      <View style={styles.progressBarWrapper}>
        <Progress.Bar
          indeterminate
          indeterminateAnimationDuration={2000}
          width={null}
          height={30}
          color={theme.colors.primary}
        />
        <TextComponent style={styles.progressText}>{t(`summarizing_text`)}</TextComponent>
      </View>
    );
  };

  const summaryDetailView = ({ summary }: SummaryDetailProps) => {
    return (
      <View>
        <SummaryDetail summary={summary} />
        <View style={styles.photoButtonWrapper}>
          <ButtonComponent label="navigateToCamera" onPress={takePhoto} />
        </View>
      </View>
    );
  };

  const views = () => {
    if (hasError) {
      return errorView();
    } else if (!isLoading && summary) {
      return summaryDetailView({
        summary: {
          title: summary.summaryTitle,
          body: summary.summaryBody,
          action: summary.summaryAction,
        },
      });
    } else {
      return progressBarView();
    }
  };

  return (
    <ScrollView
      style={styles.summaryGeneratePageWrapper}
      contentContainerStyle={styles.contentContainer}>
      {views()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryGeneratePageWrapper: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarWrapper: {
    width: '100%',
  },
  progressText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: theme.font.large,
  },
  photoButtonWrapper: {
    marginVertical: 30,
  },
  errorMessage: {
    fontSize: theme.font.large,
  },
});
