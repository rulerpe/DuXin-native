import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../components/ProgressBar';
import SummaryDetail, { SummaryDetailProps } from '../components/SummaryDetail';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
import { useTakePhoto } from '../hooks/useTakePhoto';
import theme from '../theme';
import useActionCable from '../hooks/useActionCable';
import { STAGES } from '../types';
import ApiService from '../services/ApiService';
import { router } from 'expo-router';

export default function SummaryGeneratePage() {
  const { image, takePhoto } = useTakePhoto();
  const [isUploading, setIsUploading] = useState(false);
  const { currentStage, translatedSummary, resetStage } = useActionCable(
    'SummaryTranslationChannel',
  );
  const [uploadError, setUploadError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        resetStage();
        try {
          setIsUploading(true);
          const formData = new FormData();
          //@ts-ignore
          formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' });
          await ApiService.uploadImage(formData);
        } catch (error) {
          setUploadError(true);
        } finally {
          setIsUploading(false);
        }
      }
    };
    uploadImage();
  }, [image]);

  const onTryAgain = () => {
    router.navigate('/');
  };

  const errorView = () => {
    return (
      <View>
        <TextComponent style={styles.errorMessage}>{t('summaryGeneratePageError')}</TextComponent>
        <View style={styles.photoButtonWrapper}>
          <ButtonComponent label={t('tryAgian')} onPress={onTryAgain} isLoading={isUploading} />
        </View>
      </View>
    );
  };
  const progressBarView = () => {
    return (
      <View style={styles.progressBarWrapper}>
        <ProgressBar stages={Object.keys(STAGES)} currentStage={STAGES[currentStage]} />
        <TextComponent style={styles.progressText}>{t(`${currentStage}`)}</TextComponent>
      </View>
    );
  };

  const summaryDetailView = ({ summary }: SummaryDetailProps) => {
    return (
      <View>
        <SummaryDetail summary={summary} />
        <View style={styles.photoButtonWrapper}>
          <ButtonComponent
            label={t('navigateToCamera')}
            onPress={takePhoto}
            isLoading={isUploading}
          />
        </View>
      </View>
    );
  };

  const views = () => {
    if (currentStage === 'error' || uploadError) {
      return errorView();
    } else if (currentStage === 'summary_translation_completed' && translatedSummary) {
      return summaryDetailView({
        summary: {
          title: translatedSummary.title,
          body: translatedSummary.body,
          action: translatedSummary.action,
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
    marginTop: 30,
  },
  errorMessage: {
    fontSize: theme.font.large,
  },
});
