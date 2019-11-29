<template>
  <header>
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
  </header>
</template>

<script lang="ts">
import { Component, Watch, Emit, Prop, Vue } from 'vue-property-decorator';
import { uniq } from '@/libs/util';

@Component
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
    this.tagsRef.get().then((tags) => {
      tags.forEach((tag) => {
        this.tags.push('#' + tag.data().text);
      });
    });
  }

  @Watch('$route')
  private onChangeRoute() {
    const query = this.$route.query.query;

    if (typeof query === 'string' && query !== '') {
      const splitedQuery = query.split('&');
    }
  }

  private onEdit() {
    this.input(this.searchQueries);
  }

  @Emit('input')
  private input(query: {
    tags: string[];
    words: string[];
    inputingWord: string;
  }) {}

  private get searchQueries() {
    // なぜかsearchがnullになるため参考演算子を利用する
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

<style lang="scss" scoped></style>
