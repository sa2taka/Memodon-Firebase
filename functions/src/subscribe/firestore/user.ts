import { EventContext } from 'firebase-functions';
import { firestore } from 'firebase-admin';

import fetchTwitterMemo from '../../fetchMemos/fetchTwitterMemo';
import updateUserFetchedTime from '../../fetchMemos/updateUserFetchedTime';
import { consumerKey, consumerSecret } from '../../secrets/twitter';
const crypto = require('crypto');

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
    .then((value) => {
      const secretData = value.data();

      if (!secretData) {
        return;
      }
      const { token, secret } = secretData[userData.twitterId];

      return fetchTwitterMemo(userData.twitterId, token, secret);
    })
    .then((noteForUser) => {
      if (!noteForUser) {
        return;
      }

      const noteForMemo = noteForUser.map((value: any) => {
        value.uid = snap.id;
        value.user = userRef;

        return value;
      });

      return Promise.all([
        addNoteIntoUserSubCollection(noteForUser, snap.id),
        addNoteIntoMemoCollection(noteForMemo),
      ]);
    });
}

function addNoteIntoUserSubCollection(newNote: Array<any>, userId: string) {
  const dividedNote = divideArrIntoPieces(newNote, 500);

  return Promise.all(
    dividedNote.map((note) => {
      const batch = firestore().batch();

      note.forEach((memo) => {
        const uidStr = memo.provider + memo.id;
        const uid = crypto
          .createHash('sha256')
          .update(uidStr, 'utf8')
          .digest('hex');

        console.log({
          error_occured: {
            uidStr,
            uid,
            userId,
          },
        });
        const ref = firestore()
          .collection('users')
          .doc(userId)
          .collection('memos')
          .doc(uid);
        batch.set(ref, memo);
      });

      return batch.commit();
    })
  );
}

function addNoteIntoMemoCollection(newNote: Array<any>) {
  const dividedNote = divideArrIntoPieces(newNote, 500);

  return Promise.all(
    dividedNote.map((note) => {
      const batch = firestore().batch();

      note.forEach((memo) => {
        const uidStr = memo.provider + memo.id;
        const uid = crypto
          .createHash('sha256')
          .update(uidStr, 'utf8')
          .digest('hex');
        const ref = firestore()
          .collection('memos')
          .doc(uid);
        batch.set(ref, memo);
      });

      return batch.commit();
    })
  );
}

function divideArrIntoPieces(arr: Array<any>, n: number) {
  const arrList = [];
  const idx = 0;
  while (idx < arr.length) {
    arrList.push(arr.splice(idx, idx + n));
  }
  return arrList;
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
