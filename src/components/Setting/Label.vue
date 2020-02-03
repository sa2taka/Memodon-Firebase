<template>
  <div class="mt-4 mb-3">
    <v-chip
      :color="label.color"
      class="user-label"
      close
      close-icon="mdi-close"
      label
      @click:close="deleteLabel"
    >
      <v-btn text icon x-small>
        <v-icon :color="isCloseToBlack ? 'white' : 'black'">fa-palette</v-icon>
      </v-btn>
      <v-text-field
        :class="[
          isCloseToBlack ? 'white-caret' : 'black-caret',
          'label-input',
          'mt-2',
          'ml-2',
        ]"
        :placeholder="$t('label-placeholder')"
        v-model="labelText"
      ></v-text-field>
    </v-chip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import firebase from '@/firebase';

@Component
export default class Label extends Vue {
  @Prop({ required: true })
  public label!: {
    id: string;
    color: string;
    text: string;
    tag: string;
    appendDate: firebase.firestore.Timestamp;
  };
  public labelText = this.label.text;

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

  private get isCloseToBlack() {
    const colorMatch = this.label.color.match(
      /#([0-9a-f-A-F]{2})([0-9a-f-A-F]{2})([0-9a-f-A-F]{2})/
    );

    if (!colorMatch) {
      return false;
    }

    const [_, ...color] = colorMatch;
    return color.reduce((a, b) => a + parseInt(b, 16), 0) / 3 < 384; // 256 * 3 / 2
  }
}
</script>

<style lang="scss">
.white-caret input {
  caret-color: white !important;
  color: white;
}

.black-caret input {
  caret-color: black !important;
  color: black;
}

// HACK: Delete v-text-field underline
.v-input__slot::before,
.v-input__slot::after {
  content: none !important;
}
</style>

<i18n>
{
  "en": {
    "label-placeholder": "Input label name"
  }, 
  "jp": {
    "label-placeholder": "ラベル名を入力"
  }
}
</i18n>
