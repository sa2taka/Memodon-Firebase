import { firestore } from 'firebase-admin';

import updateNote from '../firestore/updateNote';

export function fetchAllUsersNote(userSnapshot: firestore.DocumentSnapshot) {
  // const subUserCollecgion = snapshot.ref.collection('subUsers');
  const promises = [updateNote(userSnapshot)];

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
