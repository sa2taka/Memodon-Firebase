import { AccountCredentials } from 'masto';
import { firestore } from 'firebase-admin';
import { updateSubUserNote } from './updateNote';
import { generateUUID } from '../util';

export function saveAccessToken(
  uid: string,
  hostname: string,
  token: string,
  id: string
) {
  const data = {
    accessToken: token,
  };
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('secrets')
    .doc(generateUUID(hostname + id))
    .set(data);
}

export function saveMastodonUser(
  uid: string,
  hostname: string,
  uri: string,
  credential: AccountCredentials
) {
  const data = {
    providerId: credential.id,
    userName: credential.username,
    displayName: credential.display_name,
    iconUrl: credential.avatar,
    provider: hostname,
    uri,
  };
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('subusers')
    .doc(generateUUID(hostname + credential.id))
    .set(data);
}

export function saveMastodonMemo(
  mainUserSnapshot: FirebaseFirestore.DocumentSnapshot,
  memoUserSnapshot: FirebaseFirestore.DocumentSnapshot
) {
  return updateSubUserNote(mainUserSnapshot, memoUserSnapshot);
}
