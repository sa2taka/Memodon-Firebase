import * as admin from 'firebase-admin';
admin.initializeApp();

import { onCreate } from './subscribe/firestore/user';
import { fetchMemo } from './subscribe/https/fetchMemo';
import { authenticateMastodon } from './subscribe/https/authenticateMastodon';
import { getMastodonToken } from './subscribe/https/getMastodonToken';
import { searchFullText } from './subscribe/https/searchFullText';

exports.onCreateUser = onCreate;
exports.fetchMemo = fetchMemo;
exports.authenticateMastodon = authenticateMastodon;
exports.getMastodonToken = getMastodonToken;
exports.searchFullText = searchFullText;
