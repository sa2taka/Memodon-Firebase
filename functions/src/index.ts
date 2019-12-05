import * as admin from 'firebase-admin';
admin.initializeApp();

import * as User from './subscribe/firestore/user';
import * as FetchMemo from './subscribe/https/fetchMemo';

exports.onCreateUser = User.onCreate;
exports.onCallFetchMemo = FetchMemo.fetchMemo;
