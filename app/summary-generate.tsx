import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import * as Progress from 'react-native-progress';

import ButtonComponent from '../components/ButtonComponent';
import IconButton from '../components/IconButton';
import SummaryDetail, { SummaryDetailProps } from '../components/SummaryDetail';
import TextComponent from '../components/TextComponent';
import { usePhoto } from '../contexts/PhotoContext';
import { useUser } from '../contexts/UserContext';
import FirebaseFactory from '../services/firebase/FirebaseFactory';
import theme from '../theme';
import { Summary } from '../types';

export default function SummaryGeneratePage() {
  const { image, takePhoto, clearImage } = usePhoto();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<Summary | null>(null);
  const { user, setUser } = useUser();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    if (!image) {
      // redirect to home page if visit without any image
      router.replace('/');
    }
    return clearImage;
  }, []);
  useEffect(() => {
    if (image) {
      processImage();
    }
  }, [image]);

  const processImage = async () => {
    console.log('process Imgage');
    try {
      setIsLoading(true);
      if (user?.userType === 'TEMP' && user.totalSummaries > 0 && user.totalSummaries % 5 === 0) {
        setShowSignUpModal(true);
      }
      const { data } = await FirebaseFactory.getSummaryTranslation(image, i18n.language);
      setSummary(data);
      if (user) {
        const totalSummaries = user.totalSummaries ? user.totalSummaries + 1 : 1;
        await FirebaseFactory.updateUserTotalSummaries(user, totalSummaries);
        setUser({ ...user, totalSummaries });
      }
    } catch (error) {
      setHasError(true);
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onTryAgain = () => {
    router.navigate('/');
  };

  const onTakePhoto = async () => {
    await takePhoto();
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
          <ButtonComponent label="navigateToCamera" onPress={onTakePhoto} />
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
      <Modal
        animationType="slide"
        transparent
        visible={showSignUpModal}
        onRequestClose={() => {
          setShowSignUpModal(!showSignUpModal);
        }}>
        <View style={styles.centeredModal}>
          <View style={styles.modalView}>
            <View style={styles.modelClose}>
              <IconButton
                icon="window-close"
                onPress={() => setShowSignUpModal(!showSignUpModal)}
                size={35}
              />
            </View>
            <View>
              <TextComponent style={{ paddingBottom: 20 }}>{t('signupModal')}</TextComponent>
              <ButtonComponent
                label={t('singupButton')}
                onPress={() => router.navigate('/login')}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  centeredModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modelClose: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
