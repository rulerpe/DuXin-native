import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { setAnalyticsCollectionEnabled, logEvent } from 'firebase/analytics';
import {
  signInAnonymously,
  connectAuthEmulator,
  onAuthStateChanged,
  signOut,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  connectFirestoreEmulator,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { Platform } from 'react-native';

import { setupAppCheck } from './mobile/appCheckService';
import initFirebaseWeb from './web/firebaseWebConfig';
import { User } from '../../types';

class FirebaseFactory {
  public firebaseweb;
  constructor() {
    if (Platform.OS === 'web') {
      this.firebaseweb = initFirebaseWeb();
    }
  }

  public setupEmulators() {
    console.log('setup emulator');
    if (Platform.OS === 'web' && this.firebaseweb) {
      connectAuthEmulator(this.firebaseweb.auth, 'http://localhost:9099');
      connectFirestoreEmulator(this.firebaseweb.firestore, 'localhost', 8080);
      connectFunctionsEmulator(this.firebaseweb.functions, 'localhost', 5001);
    } else {
      auth().useEmulator('http://localhost:9099');
      firestore().useEmulator('localhost', 8080);
      functions().useEmulator('localhost', 5001);
    }
  }

  public async appCheckInit(): Promise<void> {
    if (Platform.OS !== 'web') {
      await setupAppCheck();
    }
  }

  public analyticsInit() {
    if (Platform.OS === 'web' && this.firebaseweb) {
      if (!__DEV__) {
        setAnalyticsCollectionEnabled(this.firebaseweb.analytics, true);
      } else {
        setAnalyticsCollectionEnabled(this.firebaseweb.analytics, false);
      }
    } else {
      if (!__DEV__) {
        analytics().setAnalyticsCollectionEnabled(true);
      } else {
        analytics().setAnalyticsCollectionEnabled(false);
      }
    }
  }

  public async analyticsLogPageView(pathname: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      await logEvent(this.firebaseweb.analytics, 'page_view', {
        page_path: pathname,
      });
    } else {
      await analytics().logScreenView({
        screen_name: pathname,
        screen_class: pathname,
      });
    }
  }

  public async analyticsLogEvent(eventName: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      await logEvent(this.firebaseweb.analytics, eventName, {
        button_name: eventName,
      });
    } else {
      await analytics().logEvent(eventName, {
        button_name: eventName,
      });
    }
  }

  public async signInAnonymously() {
    if (Platform.OS === 'web' && this.firebaseweb) {
      await signInAnonymously(this.firebaseweb.auth);
    } else {
      await auth().signInAnonymously();
    }
  }
  // TODO: fix listener type
  public onAuthStateChanged(listener: any): () => void {
    if (Platform.OS === 'web' && this.firebaseweb) {
      return onAuthStateChanged(this.firebaseweb.auth, listener);
    } else {
      return auth().onAuthStateChanged(listener);
    }
  }

  public async authSignOut() {
    if (Platform.OS === 'web' && this.firebaseweb) {
      await signOut(this.firebaseweb.auth);
    } else {
      await auth().signOut();
    }
  }
  public async authDeleteUser() {
    if (Platform.OS === 'web' && this.firebaseweb?.auth.currentUser) {
      await deleteUser(this.firebaseweb.auth.currentUser);
    } else {
      await auth().currentUser?.delete();
    }
  }

  public async getUserMeta(userId: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const docRef = doc(this.firebaseweb.firestore, 'users', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      const docSnap = await firestore().collection('users').doc(userId).get();
      return docSnap.exists ? docSnap.data() : null;
    }
  }

  public async setUserMeta(userId: string, userMetaObj: User) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const docRef = doc(this.firebaseweb.firestore, 'users', userId);
      await setDoc(docRef, userMetaObj);
    } else {
      await firestore().collection('users').doc(userId).set(userMetaObj);
    }
  }

  public async updateUserLanguage(userId: string, language: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const docRef = doc(this.firebaseweb.firestore, 'users', userId);
      await updateDoc(docRef, { language });
    } else {
      await firestore().collection('users').doc(userId).update({ language });
    }
  }

  public async firestoreGetSummaries(
    userId: string | undefined,
    pageSize: number,
    lastVisible: any,
  ) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      let q = query(
        collection(this.firebaseweb.firestore, 'summaries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
      );
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
      return await getDocs(q);
    } else {
      let query = firestore()
        .collection('summaries')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(pageSize);
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }
      return await query.get();
    }
  }

  public async deleteSummary(summaryId: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const docRef = doc(this.firebaseweb.firestore, 'summaries', summaryId);
      await deleteDoc(docRef);
    } else {
      await firestore().collection('summaries').doc(summaryId).delete();
    }
  }

  public async getImageSummary(image: string | null, language: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const getImageSummaryCall = httpsCallable(this.firebaseweb.functions, 'getImageSummary');
      return await getImageSummaryCall({ image, language });
    } else {
      return await functions().httpsCallable('getImageSummary')({
        image,
        language,
      });
    }
  }
}

export default new FirebaseFactory();
