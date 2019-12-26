import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

let firebaseConfig: any;
if (process.env.ENV == 'prod') {
  // 本番環境の設定値
  firebaseConfig = {
    apiKey: 'AIzaSyA6jD4e0Ghm1JtDvtmO5PSNnnDCrqPs0m8',
    authDomain: 'memodon-js.firebaseapp.com',
    databaseURL: 'https://memodon-js.firebaseio.com',
    projectId: 'memodon-js',
    storageBucket: 'memodon-js.appspot.com',
    messagingSenderId: '66517605506',
    appId: '1:66517605506:web:172115d94244e129ed289b',
  };
} else {
  // 検証環境の設定値
  firebaseConfig = {
    apiKey: 'AIzaSyCTL4D-XxILYUBu2MF4C0pvomSkSG9vHBc',
    authDomain: 'memodon-dev.firebaseapp.com',
    databaseURL: 'https://memodon-dev.firebaseio.com',
    projectId: 'memodon-dev',
    storageBucket: 'memodon-dev.appspot.com',
    messagingSenderId: '441751535705',
    appId: '1:441751535705:web:465f1a2b70652d1b51f148',
  };
}

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
