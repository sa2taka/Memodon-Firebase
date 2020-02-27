<template>
  <div id="labels" class="mt-4 mb-3">
    <v-subheader>{{ $t('label') }}</v-subheader>

    <user-label
      :label="label"
      v-for="label in labels"
      :key="label.id"
    ></user-label>

    <add-label-button class="primary"></add-label-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/firebase';

import AddLabelButton from '@/components/Setting/AddLabelButton.vue';
import UserLabel from '@/components/Setting/Label.vue';

import { Label } from '@/types/label';

@Component({
  components: {
    AddLabelButton,
    UserLabel,
  },
})
export default class Labels extends Vue {
  public labels: Label[] = [];

  public created() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('labels')
      .orderBy('appendDate')
      .onSnapshot((snapshot) => {
        this.labels = snapshot.docs.map((label) => {
          const data = label.data()!;
          data.id = label.id;
          return data as Label;
        });
      });
  }
}
</script>

<style lang="scss" scoped>
#labels {
  width: 75%;
}
</style>

<i18n>
{
  "jp": {
    "label": "ラベル"
  },
  "en": {
    "label": "Labels"
  }
}
</i18n>
