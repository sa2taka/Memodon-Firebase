import { firestore } from 'firebase-admin';
import { generateUUID } from '../util';
const flatMap = require('array.prototype.flatmap');

export default async function addTag(note: Array<any>, userId: string) {
  const tags = extractTags(note);

  const tagSnaps = tags.map((tag) => {
    return {
      text: tag,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
  });

  return Promise.all([
    addTagIntoRoot(tagSnaps),
    addTagIntoUser(tagSnaps, userId),
  ]);
}

function addTagIntoUser(tags: Array<any>, userId: string) {
  return Promise.all(
    tags.map((tag) => {
      const ref = firestore()
        .collection('users')
        .doc(userId)
        .collection('tags')
        .doc(generateUUID(tag.text));
      return writeTag(ref, tag);
    })
  );
}

function addTagIntoRoot(tags: Array<any>) {
  return Promise.all(
    tags.map((tag) => {
      const ref = firestore()
        .collection('tags')
        .doc(generateUUID(tag.text));
      return writeTag(ref, tag);
    })
  );
}

function writeTag(ref: firestore.DocumentReference, tag: any) {
  return ref.get().then((snap: firestore.DocumentSnapshot) => {
    const isTagExists = snap.exists;
    if (!isTagExists) {
      tag['createdAt'] = firestore.FieldValue.serverTimestamp();
    }
    return ref.set(tag);
  });
}

function extractTags(note: Array<any>): Array<string> {
  return uniq(
    flatMap(note, (memo: any) => {
      return memo.entities.hashtags.filter((tag: string) => {
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
