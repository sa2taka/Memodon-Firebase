<template>
  <v-container justify="center" mt-9>
    <note :note="note" v-if="note.length !== 0"></note>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Note from '@/components/Note/Note.vue';
import firebase from '@/firebase';
import { Memo } from '@/types/memo';
@Component({
  components: { Note },
})
export default class NotePage extends Vue {
  private note: Array<Memo> = [];

  public created() {
    this.fetchNote();
  }

  private fetchNote() {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.fetchUsersNote(user);
        }
      });
      return;
    }

    this.fetchUsersNote(currentUser);
  }

  private fetchUsersNote(user: firebase.User, tag?: string) {
    const ref = firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('memos');

    ref.get().then((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.note.push(snapshot.data() as Memo);
      });
    });
  }
}
</script>

<style lang="scss"></style>
