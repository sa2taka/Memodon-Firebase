import * as admin from 'firebase-admin';
admin.initializeApp();

import { onCreate } from './subscribe/firestore/user';
import { fetchMemo } from './subscribe/https/fetchMemo';
import { getMastodonClientInfo } from './subscribe/https/getMastodonClientInfo';
import { getMastodonToken } from './subscribe/https/getMastodonToken';

exports.onCreateUser = onCreate;
exports.fetchMemo = fetchMemo;
exports.getMastodonClientInfo = getMastodonClientInfo;
exports.getMastodonToken = getMastodonToken;
