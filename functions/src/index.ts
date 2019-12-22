import * as admin from 'firebase-admin';
admin.initializeApp();

import * as User from './subscribe/firestore/user';
import * as FetchMemo from './subscribe/https/fetchMemo';
import * as AuthMastodon from './subscribe/https/authenticateMastodon';

exports.onCreateUser = User.onCreate;
exports.fetchMemo = FetchMemo.fetchMemo;
exports.authenticateMastodon = AuthMastodon.authenticateMastodon;
