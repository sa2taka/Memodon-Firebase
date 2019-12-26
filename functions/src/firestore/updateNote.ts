import { firestore } from 'firebase-admin';

import fetchTwitterMemo from '../fetchMemos/fetchTwitterMemo';
import addTag from './addTag';
import addMemos from './addMemos';
import updateUserFetchedTime from './updateUserFetchedTime';

export default function updateNote(
  userSnapshot: firestore.DocumentSnapshot
): Promise<any> {
  const userData = userSnapshot.data();
  if (!userData) {
    return Promise.resolve();
  }

  const secretsPromise = userSnapshot.ref
    .collection('secrets')
    .doc('twitter.com')
    .get();

  const memosPromise = userSnapshot.ref
    .collection('memos')
    .orderBy('id', 'desc')
    .limit(1)
    .get();

  return Promise.all([secretsPromise, memosPromise])
    .then((resolved) => {
      const [twitterSecretsSnap, memosSnap] = resolved;
      const secretData = twitterSecretsSnap.data();
      const latestMemoDoc = memosSnap.docs[0];
      let latestMemoId: string | undefined;

      if (latestMemoDoc) {
        latestMemoId = latestMemoDoc.data().id.toString();
      } else {
        latestMemoId = undefined;
      }

      if (!secretData) {
        return;
      }

      const { token, secret } = secretData[userData.twitterId];
      return fetchTwitterMemo(userData.twitterId, token, secret, latestMemoId);
    })
    .then((noteWithoutUser: Array<any> | undefined) => {
      if (!noteWithoutUser) {
        return;
      }

      const note = noteWithoutUser.map((value: any) => {
        value.uid = userSnapshot.id;
        value.user = userSnapshot.ref;

        return value;
      });

      return Promise.all([
        addMemos(note, userSnapshot.id),
        addTag(noteWithoutUser, userSnapshot.id),
        updateUserFetchedTime(userSnapshot.id),
      ]);
    });
}
