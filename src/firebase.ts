import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA6jD4e0Ghm1JtDvtmO5PSNnnDCrqPs0m8',
  authDomain: 'memodon-js.firebaseapp.com',
  databaseURL: 'https://memodon-js.firebaseio.com',
  projectId: 'memodon-js',
  storageBucket: 'memodon-js.appspot.com',
  messagingSenderId: '66517605506',
  appId: '1:66517605506:web:172115d94244e129ed289b',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
