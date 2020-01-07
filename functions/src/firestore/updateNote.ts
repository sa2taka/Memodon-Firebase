import { firestore } from 'firebase-admin';

import fetchTwitterMemo from '../fetchMemos/fetchTwitterMemo';
import fetchMastodonMemo from '../fetchMemos/fetchMastodonMemo';
import addTag from './addTag';
import addMemos from './addMemo';
import updateUserFetchedTime from './updateUserFetchedTime';
import { generateUUID } from '../util';

export function updateNote(userSnapshot: firestore.DocumentSnapshot) {
  if (!isAfter15Minues(userSnapshot)) {
    return Promise.resolve(
      '{"error": "15 minutes have not passed since the last fetching"}'
    );
  }
  // const subUserCollecgion = snapshot.ref.collection('subUsers');
  const promises = [
    updateMainUserNote(userSnapshot),
    updateUserFetchedTime(userSnapshot.id),
  ];

  return Promise.all(promises).then(() => {
    return Promise.resolve('{"success": "success"}');
  });
}

export function updateNoteFromId(uuid: string) {
  return firestore()
    .collection('users')
    .doc(uuid)
    .get()
    .then((snap: firestore.DocumentSnapshot) => {
      return updateNote(snap);
    });
}

export function updateSubUserNote(
  mainUserSnapshot: FirebaseFirestore.DocumentSnapshot,
  memoUserSnapshot: FirebaseFirestore.DocumentSnapshot
): Promise<any> {
  const memoUserData = memoUserSnapshot.data();
  if (!memoUserData) {
    return Promise.reject();
  }

  let noteGetterPromise: Promise<any>;
  if (memoUserData.provider === 'twitter.com') {
    noteGetterPromise = getTwitterNote(mainUserSnapshot, memoUserSnapshot);
  } else {
    noteGetterPromise = getMastodonNote(mainUserSnapshot, memoUserSnapshot);
  }

  return noteGetterPromise.then((noteWithoutUser: any[] | undefined) => {
    if (!noteWithoutUser) {
      return Promise.reject('{"error": fetch error}');
    }

    return saveWithUserInfo(
      memoUserSnapshot.ref,
      memoUserData.providerId,
      mainUserSnapshot.id,
      noteWithoutUser
    );
  });
}

export function updateMainUserNote(
  userSnapshot: firestore.DocumentSnapshot
): Promise<any> {
  return getTwitterNote(userSnapshot, userSnapshot).then(
    (noteWithoutUser: any[] | undefined) => {
      if (!noteWithoutUser) {
        return Promise.reject('{"error": fetch error}');
      }
      return saveWithUserInfo(
        userSnapshot.ref,
        'twitter.com',
        userSnapshot.id,
        noteWithoutUser
      );
    }
  );
}

function getTwitterNote(
  mainUserSnapshot: FirebaseFirestore.DocumentSnapshot,
  memoUserSnapshot: FirebaseFirestore.DocumentSnapshot
): Promise<any> {
  const memoUserData = memoUserSnapshot.data();
  if (!memoUserData) {
    return Promise.reject('Data does not exits');
  }

  const secretsPromise = mainUserSnapshot.ref
    .collection('secrets')
    .doc(generateUUID(memoUserData.provider + memoUserData.providerId))
    .get();

  const memosPromise = latestMemoRef(
    mainUserSnapshot,
    memoUserData.provider,
    memoUserData.providerId
  );

  return Promise.all([secretsPromise, memosPromise]).then((resolved) => {
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
      return Promise.reject('Secret data does not exist');
    }

    const { token, secret } = secretData;
    return fetchTwitterMemo(
      memoUserData.providerId,
      token,
      secret,
      latestMemoId
    );
  });
}

function getMastodonNote(
  mainUserSnapshot: FirebaseFirestore.DocumentSnapshot,
  memoUserSnapshot: FirebaseFirestore.DocumentSnapshot
): Promise<any> {
  const memoUserData = memoUserSnapshot.data();
  if (!memoUserData) {
    return Promise.reject('Data does not exits');
  }

  const memosPromise = latestMemoRef(
    mainUserSnapshot,
    memoUserData.provider,
    memoUserData.providerId
  );

  const accessTokenPromise = mainUserSnapshot.ref
    .collection('secrets')
    .doc(generateUUID(memoUserData.provider + memoUserData.providerId))
    .get();

  return Promise.all([accessTokenPromise, memosPromise]).then((resolved) => {
    const [accessTokenSnap, memosSnap] = resolved;
    const accessTokenData = accessTokenSnap.data();
    const latestMemoDoc = memosSnap.docs[0];
    let latestMemoId: string | undefined;

    if (latestMemoDoc) {
      latestMemoId = latestMemoDoc.data().id.toString();
    } else {
      latestMemoId = undefined;
    }

    if (!accessTokenData) {
      return Promise.reject('AccessToken does not exist');
    }

    return fetchMastodonMemo(
      memoUserData.uri,
      memoUserData.providerId,
      accessTokenData.accessToken,
      latestMemoId
    );
  });
}

function saveWithUserInfo(
  userSnapshotRef: firestore.DocumentReference,
  memoUserId: string,
  mainUserId: string,
  noteWithoutUser: any[]
) {
  if (!noteWithoutUser) {
    return;
  }

  const note = noteWithoutUser.map((value: any) => {
    value.uid = memoUserId;
    value.user = userSnapshotRef;

    return value;
  });

  return Promise.all([
    addMemos(note, mainUserId),
    addTag(noteWithoutUser, mainUserId),
  ]);
}

function latestMemoRef(
  userSnapshot: FirebaseFirestore.DocumentSnapshot,
  provider: string,
  providerId: string
) {
  return userSnapshot.ref
    .collection('memos')
    .orderBy('id', 'desc')
    .where('provider', '==', provider)
    .where('provider', '==', providerId)
    .limit(1)
    .get();
}

function isAfter15Minues(userSnapshot: firestore.DocumentSnapshot) {
  const data = userSnapshot.data();
  if (!data) {
    return true;
  }
  try {
    const lastFetchDay: Date = data.lastFetched.toDate();
    const fifteenMinutesAfterlastFetchDay =
      lastFetchDay.getTime() + 15 * 60 * 1000;
    return Date.now() > fifteenMinutesAfterlastFetchDay;
  } catch {
    return true;
  }
}
