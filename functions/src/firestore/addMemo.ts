import { firestore } from 'firebase-admin';
const crypto = require('crypto');

let batch = firestore().batch();
let refCount = 0;
let batches: Promise<any>[] = [];

export default function addMemo(note: Array<any>, userId: string) {
  addNoteIntoMemoCollection(note);
  addNoteIntoUserSubCollection(note, userId);

  batches.push(batch.commit());
  const _b = batches;
  batches = [];
  return Promise.all(_b);
}

function addNoteIntoUserSubCollection(newNote: Array<any>, userId: string) {
  const dividedNote = divideArrIntoPieces(newNote, 500);

  return Promise.all(
    dividedNote.map((note) => {
      note.forEach((memo) => {
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
        setBatch(ref, memo);
      });
    })
  );
}

function addNoteIntoMemoCollection(newNote: Array<any>) {
  const dividedNote = divideArrIntoPieces(newNote, 500);

  return Promise.all(
    dividedNote.map((note) => {
      note.forEach((memo) => {
        const uidStr = memo.provider + memo.id;
        const uid = crypto
          .createHash('sha256')
          .update(uidStr, 'utf8')
          .digest('hex');
        const ref = firestore()
          .collection('memos')
          .doc(uid);
        setBatch(ref, memo);
      });
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

function setBatch(ref: firestore.DocumentReference, memo: any) {
  batch.set(ref, memo);
  refCount += 1;
  if (refCount >= 500) {
    batches.push(batch.commit());
    refCount = 0;
    batch = firestore().batch();
  }
}
