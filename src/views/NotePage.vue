<template>
  <v-container justify="center" mt-9>
    <note-header
      :tagsRef="tagsRef"
      :userRef="userRef"
      @input="filterByInput"
    ></note-header>
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

  @Watch('$route')
  private onChangeRoute() {
    this.filterByQuery();
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
      this.filterByQuery();
    });
  }

  private filterByQuery() {
    const tags = this.$route.query.tags;
    const words = this.$route.query.words;
    const args = [];
    if (tags) {
      args.push(tags);
    }
    if (words) {
      args.push(words);
    }

    this.filtered = this.filterNote(...args);
  }

  private filterByInput(query: {
    tags: string[];
    words: string[];
    inputingWord: string;
  }) {
    this.filtered = this.filterNote(
      query.tags,
      query.words,
      query.inputingWord
    );
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
