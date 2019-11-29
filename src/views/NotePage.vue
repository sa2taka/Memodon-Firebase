<template>
  <v-container justify="center" mt-9>
    <note :note="filtered" v-if="note.length !== 0"></note>
  </v-container>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import Note from '@/components/Note/Note.vue';
import firebase from '@/firebase';
import { Memo } from '@/types/memo';
@Component({
  components: { Note },
})
export default class NotePage extends Vue {
  private note: Array<Memo> = [];
  private filtered: Array<Memo> = [];
  private end?: firebase.firestore.Timestamp;

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

  @Watch('$route')
  private onChangeRoute() {
    this.filtered = this.genFilterd();
  }

  private fetchUsersNote(user: firebase.User) {
    let ref = firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
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
      this.filtered = this.genFilterd();
    });
  }

  private genFilterd(): Array<Memo> {
    const query = this.$route.query.query;
    if (typeof query === 'string' && query !== '') {
      return this.note.filter((note) => {
        return note.text.includes(query);
      });
    }
    return this.note;
  }
}
</script>

<style lang="scss"></style>
