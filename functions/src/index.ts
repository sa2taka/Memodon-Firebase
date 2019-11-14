import * as admin from 'firebase-admin';
admin.initializeApp();

import * as User from './subscribe/firestore/user';

exports.onCreateUser = User.onCreate;
