<template>
  <v-container>editor</v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import firebase from '@/firebase';

@Component
export default class LabelEditor extends Vue {
  @Prop({ required: true })
  public label!: {
    id: string;
    color: string;
    text: string;
    tag: string;
    appendDate: firebase.firestore.Timestamp;
  };

  public deleteLabel() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('labels')
      .doc(this.label.id)
      .delete();
  }
}
</script>

<style lang="scss"></style>
