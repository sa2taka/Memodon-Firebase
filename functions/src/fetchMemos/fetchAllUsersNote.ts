import { firestore } from 'firebase-admin';

import updateNote from '../firestore/updateNote';

export function fetchAllUsersNote(userSnapshot: firestore.DocumentSnapshot) {
  if (isAfter15Minues(userSnapshot)) {
    return Promise.resolve(
      '{"error": "15 minutes have not passed since the last fetching"'
    );
  }
  // const subUserCollecgion = snapshot.ref.collection('subUsers');
  const promises = [updateNote(userSnapshot)];

  return Promise.all(promises).then(() => {
    return Promise.resolve('{"success": "success"');
  });
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

function isAfter15Minues(userSnapshot: firestore.DocumentSnapshot) {
  const data = userSnapshot.data();
  if (!data) {
    return false;
  }

  const lastFetchDay: Date = data.lastFetched.toDate();
  const fifteenMinutesAfterlastFetchDay =
    lastFetchDay.getTime() + 15 * 60 * 1000;
  return Date.now() < fifteenMinutesAfterlastFetchDay;
}
