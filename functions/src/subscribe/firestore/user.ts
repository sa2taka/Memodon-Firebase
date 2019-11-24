import { EventContext } from 'firebase-functions';
import { firestore } from 'firebase-admin';

import fetchTwitterMemo from '../../fetchMemos/fetchTwitterMemo';
import updateUserFetchedTime from '../../fetchMemos/updateUserFetchedTime';
import addTag from '../../firestore/addTag';
import addMemo from '../../firestore/addMemo';

import { consumerKey, consumerSecret } from '../../secrets/twitter';

const rp = require('request-promise');
const functions = require('firebase-functions');

const userInfoEndPoint = 'https://api.twitter.com/1.1/users/show.json';

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '256MB',
};

export const onCreate = functions
  .runWith(runtimeOpts)
  .firestore.document('users/{userId}')
  .onCreate((snap: firestore.DocumentSnapshot, context: EventContext) => {
    const user = snap.data();

    if (typeof user === 'undefined') {
      return;
    }

    return Promise.all([
      isPublic(user.twitterId).then((ans) => {
        return snap.ref.set({ isPublic: ans }, { merge: true });
      }),
      saveMemos(snap).then(() => {
        return updateUserFetchedTime(snap.id);
      }),
    ]);
  });

function saveMemos(snap: firestore.DocumentSnapshot): Promise<any> {
  const userData = snap.data();
  const userRef = snap.ref;

  if (!userData) {
    return Promise.resolve();
  }

  return userRef
    .collection('secrets')
    .doc('twitter.com')
    .get()
    .then((value: firestore.DocumentData) => {
      const secretData = value.data();

      if (!secretData) {
        return;
      }
      const { token, secret } = secretData[userData.twitterId];

      return fetchTwitterMemo(userData.twitterId, token, secret);
    })
    .then((noteForUser: Array<any> | undefined) => {
      if (!noteForUser) {
        return;
      }

      const note = noteForUser.map((value: any) => {
        value.uid = snap.id;
        value.user = userRef;

        return value;
      });

      return Promise.all([
        addMemo(note, snap.id),
        addTag(noteForUser, snap.id),
      ]);
    });
}

export function isPublic(twitterId: string): Promise<boolean> {
  return get(userInfoEndPoint, {
    user_id: twitterId,
  })
    .then((data: any) => {
      return !data.protected;
    })
    .catch(() => {
      return true;
    });
}

function get(url: string, qs: any) {
  return rp({
    method: 'GET',
    uri: url,
    timeout: 30 * 1000,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    },
    json: true,
    qs,
  }).catch((error: any) => {
    console.error(error);
    throw error;
  });
}
