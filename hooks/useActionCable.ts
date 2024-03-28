import { useEffect, useState } from 'react';
import { createConsumer, Cable, Subscription } from '@rails/actioncable';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { SummaryTranslationChannelMessage, STAGES, TranslatedSummaryType } from '../types';

global.addEventListener = () => {};
global.removeEventListener = () => {};
const useActionCable = (channelName: string, params?: Record<string, unknown>) => {
  const [currentStage, setCurrentStage] = useState<keyof typeof STAGES>('extracting_text');
  const [translatedSummary, setTranslatedSummary] = useState<TranslatedSummaryType | null>(null);

  useEffect(() => {
    let consumer: Cable;
    let subscription: Subscription;

    const connectChannel = async () => {
      const token = await getAuthToken();
      if (!token) {
        // TODO: handel this error
        return;
      }
      consumer = createConsumer(
        //@ts-ignore
        `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}?token=${encodeURIComponent(token)}`,
      );
      subscription = consumer.subscriptions.create(
        { channel: channelName, ...params },
        {
          received(data: SummaryTranslationChannelMessage) {
            setCurrentStage(data.stage);
            if (data.stage === 'summary_translation_completed' && data.translated_json) {
              setTranslatedSummary(data.translated_json);
            }
          },
          connected() {
            console.log('Connected to channel');
          },
          disconnected() {
            console.log('Disconnected from channel');
          },
        },
      );
    };
    connectChannel();

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [channelName, params]);

  const getAuthToken = async () => {
    if (Platform.OS === 'web') return null; // Skip for web
    return await SecureStore.getItemAsync('auth_token');
  };

  const resetStage = () => {
    setCurrentStage('extracting_text');
    setTranslatedSummary(null);
  };
  return { currentStage, translatedSummary, resetStage };
};

export default useActionCable;
