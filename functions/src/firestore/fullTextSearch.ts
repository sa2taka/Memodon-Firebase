import { firestore } from 'firebase-admin';

export default function searchFullText(
  userId: string,
  searchQueries: string[],
  _limit: number = 40,
  until?: firestore.Timestamp
) {
  let limit = _limit;
  if (limit > 100) {
    limit = 100;
  }

  let ref = firestore()
    .collection('users')
    .doc(userId)
    .collection('memos')
    .orderBy('timestamp', 'desc');

  if (until) {
    ref = ref.where('timestamp', '<', until);
  }

  return ref
    .get()
    .then((memos) => {
      const filterd = memos.docs
        .map((memo) => {
          return memo.data();
        })
        .filter((memo: any) => {
          return includes(memo, searchQueries);
        })
        .slice(0, limit);

      const result = 'success';
      const data = {
        memos: filterd,
        isFinal: filterd.length < limit,
      };
      return {
        result,
        data,
      };
    })
    .catch(() => {
      const result = 'error';
      return {
        result,
      };
    });
}

function includes(memo: any, searchQueries: string[]) {
  if (searchQueries.length === 0) {
    return true;
  }
  return searchQueries.some((query) => {
    if (memo) {
      return excludeTag(memo.text).includes(query);
    }
    return false;
  });
}

function excludeTag(text: string) {
  return text.replace(/<\/ ? [^>] +> /gi, '');
}
