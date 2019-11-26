import { firestore } from 'firebase-admin';
const crypto = require('crypto');

export default function addMemo(note: Array<any>, userId: string) {
  return Promise.all([
    addNoteIntoMemoCollection(note),
    addNoteIntoUserSubCollection(note, userId),
  ]);
}

function addNoteIntoUserSubCollection(newNote: Array<any>, userId: string) {
  return Promise.all(
    newNote.map((memo) => {
      const uidStr = memo.provider + memo.id;
      const uid = crypto
        .createHash('sha256')
        .update(uidStr, 'utf8')
        .digest('hex');

      const ref = firestore()
        .collection('users')
        .doc(userId)
        .collection('memos')
        .doc(uid);
      return writeMemo(ref, memo);
    })
  );
}

function addNoteIntoMemoCollection(newNote: Array<any>) {
  return Promise.all(
    newNote.map((memo) => {
      const uidStr = memo.provider + memo.id;
      const uid = crypto
        .createHash('sha256')
        .update(uidStr, 'utf8')
        .digest('hex');
      const ref = firestore()
        .collection('memos')
        .doc(uid);
      return writeMemo(ref, memo);
    })
  );
}

function writeMemo(ref: firestore.DocumentReference, memo: any) {
  return ref.set(memo);
}
