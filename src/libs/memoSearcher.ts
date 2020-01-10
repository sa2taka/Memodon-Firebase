import FlexSearch, { SearchOptions, Index } from 'flexsearch';
import { Memo } from '@/types/memo';
// @ts-ignore
import nGram from 'n-gram';

export default class MemoSearcher {
  private memos!: Array<Memo>;
  private index!: Index<any>;

  constructor(memos: Array<Memo>) {
    this.updateMemos(memos);
  }

  public updateMemos(memos: Array<Memo>) {
    this.memos = memos;
    this.index = this.initialIndex;
    this.createIndex();
  }

  public search(queries: string[]) {
    const filtered = this.removeSpace(queries).map((query) => {
      return {
        query,
        field: 'text',
        bool: 'or',
      };
    });
    if (filtered.length === 0) {
      return this.memos;
    }

    // @ts-ignore
    return this.index.search(filtered).then((memos) => {
      return this.sortMemo(this.extractMemoFromResult(memos));
    });
  }

  private createIndex() {
    this.memos.forEach((memo, i) => {
      this.index.add({ id: i, text: this.removeTag(memo.text) });
    });
  }

  private extractMemoFromResult(searchResult: any[]) {
    return searchResult.map(({ id }) => {
      return this.memos[id];
    });
  }

  private removeTag(str: string) {
    return str.replace(/<[^>]+>/gi, '');
  }

  private removeSpace(arr: string[]) {
    const emptyRemoved = arr.filter((str) => {
      return this.isEmptyOrOnlySpace(str);
    });
    return emptyRemoved.map((str) => {
      return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    });
  }

  private isEmptyOrOnlySpace(str: string) {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '') !== '';
  }

  private sortMemo(memos: Memo[]) {
    return memos.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }

  private get initialIndex() {
    return FlexSearch.create({
      profile: 'speed',
      encode: false,
      tokenize: nGram.bigram,
      doc: {
        id: 'id',
        field: 'text',
      },
      cache: true,
      async: true,
    });
  }
}
