import MemoSearcher from '@/libs/memoSearcher';
import { Memo } from '@/types/memo';
import firebase from '@/firebase';

describe('MemoSearcher', () => {
  let memos: any;

  beforeEach(() => {
    // @ts-ignore we need only text.
    memos = [
      {
        text: 'メモドンver0.01',
        timestamp: new firebase.firestore.Timestamp(0, 0),
      },
      {
        text: 'データベースシステムver0.01',
        timestamp: new firebase.firestore.Timestamp(0, 1),
      },
      {
        text: 'メモメモver0.01',
        timestamp: new firebase.firestore.Timestamp(0, 2),
      },
    ];
  });

  test('search', async () => {
    const searcher = new MemoSearcher(memos);
    expect(await searcher.search([])).toStrictEqual(sortMemo(memos));
    expect(await searcher.search(['メモ'])).toStrictEqual(
      sortMemo(memos).filter((m: any) => m.text.includes('メモ'))
    );
    expect(await searcher.search(['ver0.01'])).toStrictEqual(sortMemo(memos));
    expect(await searcher.search(['メモ', 'データ'])).toStrictEqual(
      sortMemo(memos)
    );

    searcher.updateMemos(memos);
    expect(await searcher.search(['ver0.01'])).toStrictEqual(sortMemo(memos));
    expect(await searcher.search(['メモ', 'データ'])).toStrictEqual(
      sortMemo(memos)
    );
  });

  function sortMemo(memos: Memo[]) {
    return memos.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }
});
