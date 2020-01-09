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

@Component({
  components: { Note, NoteHeader },
})
export default class NotePage extends Vue {
  private note: Array<Memo> = [];
  private filtered: Array<Memo> = [];
  private end?: firebase.firestore.Timestamp;
  private currentUserUID: string = '';
  private limit = 40;

  private tagsRef: firebase.firestore.CollectionReference | null = null;
  private userRef: firebase.firestore.DocumentReference | null = null;

  public created() {
    this.fetchNote();
    this.updateRef();
    this.subscribeQuery();
  }

  private fetchNote() {
    if (this.queries.length === 0) {
      this.fetchUserIdAndRun(this.fetchUsersNote);
    } else {
      this.fetchUsersNoteWithQuery(this.queries);
    }
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
        this.end = undefined;
        this.fetchNote();
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

  private fetchUsersNoteWithQuery(queries: string[]) {
    const searchFullText = firebase.functions().httpsCallable('searchFullText');

    searchFullText({
      queries,
      limit: this.limit,
      end: this.end,
    }).then((res) => {
      if (res.data.result === 'success') {
        this.filtered = res.data.data.memos;
      }
    });
  }

  private fetchUsersNote(uid: string) {
    let ref = firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('memos')
      .orderBy('timestamp', 'desc')
      .limit(this.limit);
    if (this.end) {
      ref = ref.endBefore(this.end);
    }
    ref.get().then((snapshots) => {
      if (snapshots.empty) {
        return;
      }
      this.note = [];
      snapshots.forEach((snapshot) => {
        this.end = snapshot.data().timestamp;
        this.note.push(snapshot.data() as Memo);
      });
      this.filtered = this.note;
    });
  }

  private removeEmpty(ary: string[]) {
    return ary.filter((str) => {
      return str && this.isEmptyOrOnlySpace(str);
    });
  }

  private isEmptyOrOnlySpace(str: string) {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '') === '';
  }

  private get queries() {
    const queries: string[] = [];
    if (SearchQuery.words) {
      queries.push(...this.removeEmpty(SearchQuery.words));
    }

    if (
      SearchQuery.inputingWord &&
      !this.isEmptyOrOnlySpace(SearchQuery.inputingWord)
    ) {
      queries.push(SearchQuery.inputingWord);
    }
    return queries;
  }
}
</script>

<style lang="scss"></style>
