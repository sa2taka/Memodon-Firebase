<template>
  <v-btn @click="addLabel">{{ $t('addLabel') }}</v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/firebase';

@Component
export default class AddLabelButton extends Vue {
  public addLabel() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    const defaultLable = {
      color: '#ff5722',
      text: '',
      tags: [],
      appendDate: firebase.firestore.FieldValue.serverTimestamp(),
    };
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('labels')
      .add(defaultLable);
  }
}
</script>

<style lang="scss" scoped>
#id {
  width: 90%;
}
</style>

<i18n>
{
  "jp": {
    "addLabel": "ラベルを追加する"
  },
  "en": {
    "addLabel": "Add new label"
  }
}
</i18n>
