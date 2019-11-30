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

  private tagsRef: firebase.firestore.CollectionReference | null = null;
  private userRef: firebase.firestore.DocumentReference | null = null;

  public created() {
    this.fetchNote();
    this.updateRef();
    this.subscribeQuery();
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
        this.filtered = this.filterNote(
          SearchQuery.tags,
          SearchQuery.words,
          SearchQuery.inputingWord
        );
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
      .limit(100);

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

  private filterNote(
    tag?: (string | null)[] | string,
    word?: (string | null)[] | string,
    inputingWord?: string
  ): Memo[] {
    const queries: (string | null)[] = [];
    if (tag && typeof tag === 'string') {
      queries.push(tag);
    } else if (tag) {
      queries.push(...tag);
    }

    if (word && typeof word === 'string') {
      queries.push(word);
    } else if (word) {
      queries.push(...word);
    }

    if (inputingWord) {
      queries.push(inputingWord);
    }
    if (queries.length !== 0) {
      return this.note.filter((memo) => {
        return queries.some((q) => {
          if (q) {
            return memo.text.includes(q);
          } else {
            return false;
          }
        });
      });
    } else {
      return this.note;
    }
  }
}
</script>

<style lang="scss"></style>
