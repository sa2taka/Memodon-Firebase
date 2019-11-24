import { firestore } from 'firebase-admin';
const crypto = require('crypto');

let batch = firestore().batch();
let refCount = 0;
let batches: Promise<any>[] = [];

export default function addTag(note: Array<any>, userId: string) {
  const tags = extractTags(note);

  addTagIntoRoot(tags);
  addTagIntoUser(tags, userId);

  batches.push(batch.commit());

  return Promise.all(batches);
}

function addTagIntoUser(tags: Array<any>, userId: string) {
  tags.forEach((tag) => {
    const ref = firestore()
      .collection('useres')
      .doc(userId)
      .collection('tags')
      .doc(generateUUID(tag.text));
    setBatch(ref, tag);
  });
}

function addTagIntoRoot(tags: Array<any>) {
  tags.forEach((tag) => {
    const ref = firestore()
      .collection('tags')
      .doc(generateUUID(tag.text));
    setBatch(ref, tag);
  });
}

function generateUUID(tag: string) {
  return crypto
    .createHash('sha256')
    .update(tag, 'utf8')
    .digest('hex');
}

function setBatch(ref: firestore.DocumentReference, tag: any) {
  batch.set(ref, tag);
  refCount += 1;
  if (refCount >= 500) {
    batch.commit();
    batches.push(batch);
    refCount = 0;
    batch = firestore().batch();
  }
}

function extractTags(note: Array<any>): Array<string> {
  return uniq(
    // @ts-ignore Array has flatmap
    note.flatMap((memo) => {
      return memo.entities.hashtags
        .map((tag: any) => {
          return tag.text;
        })
        .filter((tag: string) => {
          return tag !== 'メモ' && tag.toLowerCase() !== 'memo';
        });
    })
  );
}

// To be unique array's entity
function uniq(array: Array<string>) {
  const knownElements = new Map();
  for (const elem of array) {
    knownElements.set(elem, true); // 同じキーに何度も値を設定しても問題ない
  }
  return Array.from(knownElements.keys());
}
