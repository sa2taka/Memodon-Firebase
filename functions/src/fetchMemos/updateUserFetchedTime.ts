import { firestore } from 'firebase-admin';

export default function updateSerFetchedTime(uid: string) {
  return firestore()
    .collection('users')
    .doc(uid)
    .set(
      {
        lastFetched: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}
