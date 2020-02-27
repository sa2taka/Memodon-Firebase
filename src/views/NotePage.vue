<template>
  <v-container justify="center" mt-9>
    <note-header :tagsRef="tagsRef" :userRef="userRef"></note-header>
    <note :note="filtered" v-if="note.length !== 0"></note>
  </v-container>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import Note from '@/components/Note/Note.vue';
import NoteHeader from '@/components/Note/Header.vue';

import firebase from '@/firebase';

import { Memo } from '@/types/memo';
import User, { UserState } from '@/store/modules/user';
import SearchQuery from '@/store/modules/memoSearchQuery';
import MemoSearcher from '@/libs/memoSearcher';

@Component({
  components: { Note, NoteHeader },
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
  private ticking = false;

  public created() {
    this.fetchNote();
    this.updateRef();
    this.subscribeQuery();
  }

  mounted() {
    this.subscribeScroll();
  }

  beforeDestroy() {
    this.unsubscribeScroll();
  }

  @Watch('note')
  private onUpdateNote() {
    this.searcher.updateMemos(this.note);
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
      .orderBy('timestamp', 'desc')
      .limit(40);

    if (this.end) {
      ref = ref.startAfter(this.end);
    }

    ref.onSnapshot((snapshots) => {
      if (snapshots.empty) {
        this.isAllMemoCrawled = false;
        return;
      }

      snapshots.forEach((snapshot) => {
        this.end = snapshot;
        const data = snapshot.data();
        data.firebaseId = snapshot.id;
        this.note.push(data as Memo);
      });
      this.filtered = this.note;
      this.isFetching = false;
    });
  }

  // Do no use get(computed property) to prevent cache
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

  subscribeScroll() {
    document.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  unsubscribeScroll() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event: Event) {
    const lastScrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        if (
          !this.isAllMemoCrawled &&
          !this.isFetching &&
          pageHeight - windowHeight * 3 < lastScrollPosition
        ) {
          this.isFetching = true;
          this.fetchNote();
        }
        this.ticking = false;
      });

      this.ticking = true;
    }
  }
}
</script>

<style lang="scss"></style>
