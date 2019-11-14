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

// enable cache
firebase
  .firestore()
  .enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

export default firebase;
