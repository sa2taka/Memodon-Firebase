<template>
  <div class="memo-searcher">
    <v-combobox
      v-model="searchWords"
      label="Search"
      :placeholder="$t('placeholder')"
      :search-input.sync="search"
      :items="tags"
      multiple
      hide-selected
      small-chips
      @update:search-input="onEdit"
      @keyup.space="splitSearchWord"
      @blur="splitSearchWord"
    >
      <template v-slot:prepend>
        <v-icon color="primary">fa-search</v-icon>
      </template>
      <template v-slot:append>
        <v-btn text icon @click.stop="clear">
          <v-icon>fa-times</v-icon>
        </v-btn>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Emit, Prop, Vue } from 'vue-property-decorator';
import { uniq } from '@/libs/util';

import Query from '@/store/modules/memoSearchQuery';

@Component
export default class memoSearcher extends Vue {
  @Prop({ required: true })
  public tagsRef!: firebase.firestore.CollectionReference;
  @Prop()
  public userRef?: firebase.firestore.DocumentReference;
  private searchWords: string[] = [];
  private search: string = '';
  private tags: string[] = [];

  public created() {
    this.updateQuery();
    this.subscribeQuery();
  }

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

  private clear() {
    this.searchWords = [];
    this.search = '';
    Query.clear();
  }

  private onEdit() {
    this.input(this.searchQueries);
  }

  @Emit('input')
  private input(query: { words: string[]; inputingWord: string }) {
    // search ～ は参照先がMemoSearchQueryなので===で比較可能
    if (Query.words !== this.searchWords) {
      Query.setWords(this.searchWords);
    }
    if (Query.inputingWord !== this.search) {
      Query.setInputingWord(this.search);
    }
  }

  private get searchQueries() {
    // なぜかsearchがnullになるため三項演算子を利用する
    const formatedSearching = this.search
      ? this.search.replace(/^\s+/g, '').replace(/\s+$/g, '')
      : '';
    const formatedWords = this.removeSpace(this.searchWords);
    return {
      words: formatedWords,
      inputingWord: formatedSearching,
    };
  }

  private splitSearchWord() {
    const formatedStr = this.search.replace(/^\s+/g, '').replace(/\s+$/g, '');
    if (formatedStr !== '') {
      this.searchWords.push(formatedStr);
      this.search = '';
    }
  }

  private updateQuery() {
    // search ～ は参照先がMemoSearchQueryなので===で比較可能
    if (Query.words !== this.searchWords) {
      this.searchWords = Query.words;
    }
    if (Query.inputingWord !== this.search) {
      this.search = Query.inputingWord;
    }
  }

  private subscribeQuery() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('memoSearchQuery')) {
        this.updateQuery();
      }
    });
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

  @Watch('tagsRef')
  private onChangeTags() {
    this.fetchTags();
  }
}
</script>

<style lang="scss" scoped>
.serach-footer > button {
  margin-right: 0;
  margin-left: auto;
  display: block;
}
</style>

<i18n>
{
  "us": {
    "placeholder": "Press space or enter to split"
  },
  "jp": {
    "placeholder": "スペースまたはエンターで文字区切り"
  }
}
</i18n>
