<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>Search</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-autocomplete
          v-model="searchTags"
          :items="tags"
          dense
          chips
          small-chips
          label="Tags"
          multiple
          hide-selected
          class="mt-3"
          @input="onEdit"
        ></v-autocomplete>
        <v-combobox
          v-model="searchWords"
          label="Search Word"
          :search-input.sync="search"
          multiple
          small-chips
          @update:search-input="onEdit"
          @keyup.space="splitSearchWord"
          @blur="splitSearchWord"
        ></v-combobox>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
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
  private searchTags: string[] = [];
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

  private updateQuery() {
    this.searchTags = this.removeSpace(Query.tags);
    this.searchWords = this.removeSpace(Query.words);
    this.search = Query.inputingWord;
  }

  private subscribeQuery() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('memoSearchQuery')) {
        this.updateQuery();
      }
    });
  }

  @Watch('tagsRef')
  private onChangeTags() {
    this.fetchTags();
  }
}
</script>

<style lang="scss" scoped></style>
