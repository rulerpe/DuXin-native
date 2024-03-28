import { getAnalytics } from 'firebase/analytics';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyA5_sKDslOuxC7Exh9laD9lJGgPuZyaDFA',
  authDomain: 'duxin-app.firebaseapp.com',
  projectId: 'duxin-app',
  storageBucket: 'duxin-app.appspot.com',
  messagingSenderId: '627666439362',
  appId: '1:627666439362:web:81b09bfe3d3edce7fa7f5b',
  measurementId: 'G-HC4Q4ZRLGC',
};
const initFirebaseWeb = () => {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  return {
    auth: getAuth(app),
    firestore: getFirestore(app),
    functions: getFunctions(app),
    analytics: getAnalytics(app),
  };
};

export default initFirebaseWeb;
