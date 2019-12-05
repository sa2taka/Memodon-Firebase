import { firestore } from 'firebase-admin';
import fetchTwitterMemo from './fetchTwitterMemo';

export function fetchAllUsersNote(userSnapshot: firestore.DocumentSnapshot) {
  // const subUserCollecgion = snapshot.ref.collection('subUsers');
  const promises = [fetchTwitterMemoFromSnap(userSnapshot)];

  return Promise.all(promises);
}

export function fetchUserFromFireStore(uuid: string) {
  return firestore()
    .collection('users')
    .doc(uuid)
    .get()
    .then((snap: firestore.DocumentSnapshot) => {
      return fetchAllUsersNote(snap);
    });
}

function fetchTwitterMemoFromSnap(userSnapshot: firestore.DocumentSnapshot) {
  const userData = userSnapshot.data();
  if (!userData) {
    return;
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

  return Promise.all([secretsPromise, memosPromise]).then((resolved) => {
    const [twitterSecretsSnap, memosSnap] = resolved;
    const secretData = twitterSecretsSnap.data();
    const latestMemoDoc = memosSnap.docs[0];
    let latestMemoId: string;

    if (latestMemoDoc) {
      latestMemoId = latestMemoDoc.data().id.toString();
    } else {
      latestMemoId = '0';
    }

    if (!secretData || !latestMemoId) {
      return;
    }

    const { token, secret } = secretData[userData.twitterId];

    return fetchTwitterMemo(userData.twitterId, token, secret, latestMemoId);
  });
}
