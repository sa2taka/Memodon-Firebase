import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators';
import store from '@/store/index';

export interface MemoSearchQueryState {
  tags: string[];
  words: string[];
  inputingWord: string;
}

@Module({ dynamic: true, store, name: 'memoSearchQuery', namespaced: true })
class MemoSearchQuery extends VuexModule implements MemoSearchQueryState {
  public tags: string[] = [];
  public words: string[] = [];
  public inputingWord: string = '';

  @Mutation
  public setTags(tags: string[]) {
    this.tags = tags;
  }

  @Mutation
  public setWords(words: string[]) {
    this.words = words;
  }

  @Mutation
  public setInputingWord(word: string) {
    this.inputingWord = word;
  }
}

const module = getModule(MemoSearchQuery);
export default module;
