<template>
  <header>
    <fetch-memo-button class="fetch-memo-button"></fetch-memo-button>
    <memo-searcher
      class="mt-4"
      :tagsRef="tagsRef"
      :userRef="userRef"
    ></memo-searcher>
  </header>
</template>

<script lang="ts">
import { Component, Watch, Emit, Prop, Vue } from 'vue-property-decorator';
import { uniq } from '@/libs/util';

import memoSearcher from '@/components/Note/Header/memoSearcher.vue';
import fetchMemoButton from '@/components/Note/Header/fetchMemoButton.vue';

import Query from '@/store/modules/memoSearchQuery';

@Component({
  components: {
    memoSearcher,
    fetchMemoButton,
  },
})
export default class NotePageHeader extends Vue {
  @Prop({ required: true })
  public tagsRef!: firebase.firestore.CollectionReference;
  @Prop()
  public userRef?: firebase.firestore.DocumentReference;
  private searchTags: string[] = [];
  private searchWords: string[] = [];
  private search: string = '';
  private tags: string[] = [];

  public mounted() {
    this.fetchTags();
  }

  private fetchTags() {
    if (!this.tagsRef) {
      return;
    }

    this.tags = [];
    this.tagsRef.onSnapshot((tags) => {
      tags.forEach((tag) => {
        this.tags.push('#' + tag.data().text);
      });
    });
  }

  private onEdit() {
    this.input(this.searchQueries);
  }

  @Emit('input')
  private input(query: {
    tags: string[];
    words: string[];
    inputingWord: string;
  }) {
    Query.setTags(this.searchTags);
    Query.setWords(this.searchWords);
    Query.setInputingWord(this.search);
  }

  private get searchQueries() {
    // なぜかsearchがnullになるため三項演算子を利用する
    const formatedSearching = this.search
      ? this.search.replace(/^\s+/g, '').replace(/\s+$/g, '')
      : '';
    const formatedTags = this.removeSpace(this.searchTags);
    const formatedWords = this.removeSpace(this.searchWords);
    return {
      tags: formatedTags,
      words: formatedWords,
      inputingWord: formatedSearching,
    };
  }

  private removeSpace(arr: string[]) {
    const emptyRemoved = arr.filter((str) => {
      return str.replace(/^\s+/g, '').replace(/\s+$/g, '') !== '';
    });
    return emptyRemoved.map((str) => {
      return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    });
  }

  private splitSearchWord() {
    const formatedStr = this.search.replace(/^\s+/g, '').replace(/\s+$/g, '');
    if (formatedStr !== '') {
      this.searchWords.push(formatedStr);
      this.search = '';
    }
  }

  @Watch('tagsRef')
  private onChangeTags() {
    this.fetchTags();
  }
}
</script>

<style lang="scss" scoped>
.fetch-memo-button {
  margin-right: 0;
  margin-left: auto;
  display: block;
}
</style>
