import { firestore } from 'firebase-admin';
export default function addTag(note: Array<any>) {
  const tags = extractTags(note);
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
