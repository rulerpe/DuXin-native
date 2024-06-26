import analytics from '@react-native-firebase/analytics';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
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
    if (Platform.OS !== 'web') {
      if (!__DEV__) {
        analytics().setAnalyticsCollectionEnabled(true);
      } else {
        analytics().setAnalyticsCollectionEnabled(false);
      }
    } else if (Platform.OS === 'web' && this.firebaseweb?.analytics) {
      if (!__DEV__) {
        setAnalyticsCollectionEnabled(this.firebaseweb.analytics, true);
      } else {
        setAnalyticsCollectionEnabled(this.firebaseweb.analytics, false);
      }
    }
  }

  public async analyticsLogPageView(pathname: string) {
    if (Platform.OS !== 'web') {
      await analytics().logScreenView({
        screen_name: pathname,
        screen_class: pathname,
      });
    } else if (Platform.OS === 'web' && this.firebaseweb?.analytics) {
      await logEvent(this.firebaseweb.analytics, 'page_view', {
        page_path: pathname,
      });
    }
  }

  public async analyticsLogEvent(eventName: string) {
    if (Platform.OS !== 'web') {
      await analytics().logEvent(eventName, {
        button_name: eventName,
      });
    } else if (Platform.OS === 'web' && this.firebaseweb?.analytics) {
      await logEvent(this.firebaseweb.analytics, eventName, {
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

  public authIsAnonymous() {
    if (Platform.OS === 'web' && this.firebaseweb) {
      return this.firebaseweb.auth.currentUser?.isAnonymous;
    } else {
      return auth().currentUser?.isAnonymous;
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

  // setting the language code will change the OTP message language
  public authSetLanguageCode(languageCode: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      this.firebaseweb.auth.languageCode = languageCode;
    } else {
      auth().setLanguageCode(languageCode);
    }
  }

  public authVerifyPhoneNumberMobile(phoneNumber: string) {
    return auth().verifyPhoneNumber(phoneNumber);
  }

  public authsSignInWithCredentialMobile(credential: FirebaseAuthTypes.AuthCredential) {
    return auth().signInWithCredential(credential);
  }
  public authPhoneAuthStateMobile = auth.PhoneAuthState;
  public authPhoneAuthProviderMobile = auth.PhoneAuthProvider;

  public async getUserMeta(userId: string) {
    console.log('getUserMeta');
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
  public async updateUserTotalSummaries(user: User, totalSummaries: number) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const docRef = doc(this.firebaseweb.firestore, 'users', user.id);
      await updateDoc(docRef, {
        totalSummaries,
      });
    } else {
      await firestore().collection('users').doc(user.id).update({ totalSummaries });
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

  public async getSummaryTranslation(image: string | null, language: string) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const getSummaryTranslationCall = httpsCallable(
        this.firebaseweb.functions,
        'getSummaryTranslation',
      );
      return await getSummaryTranslationCall({ image, language });
    } else {
      return await functions().httpsCallable('getSummaryTranslation')({
        image,
        language,
      });
    }
  }
  public async saveUserMeta(userMeta: User) {
    if (Platform.OS === 'web' && this.firebaseweb) {
      const saveUserMetaCall = httpsCallable(this.firebaseweb.functions, 'saveUserMeta');
      return await saveUserMetaCall({ userMeta });
    } else {
      return await functions().httpsCallable('saveUserMeta')({
        userMeta,
      });
    }
  }

  // public async transferAnonymousSummaries() {
  //   if (Platform.OS === 'web' && this.firebaseweb) {
  //     const transferAnonymousSummariesCall = httpsCallable(
  //       this.firebaseweb.functions,
  //       'transferAnonymousSummaries',
  //     );
  //     return await transferAnonymousSummariesCall();
  //   } else {
  //     console.log('before calling transferAnonymousSummaries');
  //     return await functions().httpsCallable('transferAnonymousSummaries')();
  //   }
  // }
}

export default new FirebaseFactory();
