<template>
  <v-container justify="center" mt-9>
    <note-header :tagsRef="tagsRef" :userRef="userRef"></note-header>
    <paging-button-area
      class="my-3"
      @next="next"
      @prev="prev"
      :isFirstPage="isFirstPage"
      :isLastPage="isLastPage"
      :fetching="isFetching && isLastPageInFetching"
      v-show="note.length !== 0"
    />

    <note
      :note="pagingNote"
      v-for="(pagingNote, index) in splitNote"
      :key="index"
      v-show="index === page"
      :visible="index === page"
    ></note>
    <paging-button-area
      class="my-3"
      @next="next"
      @prev="prev"
      :isFirstPage="isFirstPage"
      :isLastPage="isLastPage"
      :fetching="isFetching && isLastPageInFetching"
      v-show="note.length !== 0"
    />
    <div class="empty" />
  </v-container>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import Note from '@/components/Note/Note.vue';
import NoteHeader from '@/components/Note/Header.vue';
import PagingButtonArea from '@/components/Note/PagingButtonArea.vue';

import firebase from '@/firebase';

import { Memo } from '@/types/memo';
import User, { UserState } from '@/store/modules/user';
import SearchQuery from '@/store/modules/memoSearchQuery';
import MemoSearcher from '@/libs/memoSearcher';

@Component({
  components: { Note, NoteHeader, PagingButtonArea },
})
export default class NotePage extends Vue {
  private note: Array<Memo> = [];
  private filtered: Array<Memo> = [];
  private end?: firebase.firestore.QueryDocumentSnapshot;
  private currentUserUID: string = '';
  private searcher = new MemoSearcher(this.note);

  private tagsRef: firebase.firestore.CollectionReference | null = null;
  private userRef: firebase.firestore.DocumentReference | null = null;

  private isAllMemoCrawled = false;
  private isFetching = false;
  private isFirst = true;
  private page = 0;
  private per = 40;

  public created() {
    this.fetchNote();
    this.updateRef();
    this.subscribeQuery();
  }

  @Watch('note')
  private onUpdateNote() {
    this.searcher.updateMemos(this.note);
  }

  public get splitNote() {
    const array = this.filtered.slice();
    return this.split(array, this.per);
  }

  private split(array: any[], length: number) {
    return array.reduce(
      (acc: any[][], c, i) =>
        i % length !== 0 ? acc : [...acc, array.slice(i, i + length)],
      []
    );
  }

  private divideNote(page: number) {
    return this.filtered.slice(page * this.per, (page + 1) * this.per);
  }

  private fetchNote() {
    this.fetchUserIdAndRun(this.fetchUsersNote);
  }

  private updateRef() {
    this.fetchUserIdAndRun((uid) => {
      this.userRef = firebase
        .firestore()
        .collection('users')
        .doc(uid);
      this.tagsRef = this.userRef.collection('tags');
    });
  }

  private subscribeQuery() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('memoSearchQuery')) {
        this.searcher.search(this.queries()).then((filtered: any) => {
          this.filtered = filtered;
          this.page = 0;
          if (!this.isFetching && !this.isFirst && filtered.length < this.per) {
            this.isFetching = true;
            this.fetchNote();
          }
        });
      }
    });
  }

  private fetchUserIdAndRun(callback: (uid: string) => any) {
    const currentUser = User;
    if (this.currentUserUID !== '') {
      return callback(this.currentUserUID);
    }

    if (currentUser.uid === '') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.currentUserUID = user.uid;
          return callback(user.uid);
        }
      });
    } else {
      this.currentUserUID = currentUser.uid;
      return callback(currentUser.uid);
    }
  }

  private fetchUsersNote(uid: string) {
    let ref = firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('memos')
      .orderBy('timestamp', 'desc');

    if (this.end) {
      ref = ref.startAfter(this.end);
    }
    ref = ref.limit(this.per);

    ref.get().then((snapshots) => {
      if (snapshots.empty) {
        this.isAllMemoCrawled = true;
        this.isFetching = false;
        return;
      }

      snapshots.forEach((snapshot) => {
        this.end = snapshot.data().timestamp;
        const data = snapshot.data();
        data.firebaseId = snapshot.id;
        this.note.push(data as Memo);
      });

      this.searcher.search(this.queries()).then((filtered: any) => {
        this.filtered = filtered;
        this.isFetching = false;

        if (this.isFirst && this.note.length < this.per) {
          this.isFirst = false;
          this.isAllMemoCrawled = true;
        } else if (this.isFirst) {
          this.isFirst = false;
          this.isFetching = true;
          this.fetchNote();
        } else {
          if (filtered.length < this.per) {
            this.isFetching = true;
            this.fetchNote();
          }
        }
      });
    });
  }

  // Do not use get(computed property) to prevent cache
  private queries() {
    const queries: string[] = [];
    if (SearchQuery.words) {
      queries.push(...this.removeEmpty(SearchQuery.words));
    }

    if (
      SearchQuery.inputingWord &&
      this.isEmptyOrOnlySpace(SearchQuery.inputingWord)
    ) {
      queries.push(SearchQuery.inputingWord);
    }

    return queries;
  }

  private removeEmpty(ary: string[]) {
    return ary.filter((str) => {
      return str && this.isEmptyOrOnlySpace(str);
    });
  }

  private isEmptyOrOnlySpace(str: string) {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '') !== '';
  }

  next() {
    if (!this.isLastPage) {
      this.page += 1;
      if (this.isLastPageInFetching) {
        this.fetchNextPage();
      }
    }
  }

  prev() {
    if (!this.isFirstPage) {
      this.page -= 1;
    }
  }

  fetchNextPage() {
    if (!this.isAllMemoCrawled && !this.isFetching) {
      this.isFetching = true;
      this.fetchNote();
    }
  }

  get isFirstPage() {
    return this.page <= 0;
  }

  get isLastPageInFetching() {
    return Math.ceil(this.filtered.length / this.per) - 1 <= this.page;
  }

  get isLastPage() {
    return this.isAllMemoCrawled && this.isLastPageInFetching;
  }
}
</script>

<style lang="scss">
.empty {
  height: 20vh;
  width: 100%;
}

// HACK
#app {
  overflow: hidden;
}
</style>
