<template>
  <v-card class="editor-root-card">
    <v-toolbar v-if="isSmartphoneWidth">
      <v-btn icon dark @click="$emit('close')">
        <v-icon>fa-times</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="saveLabel">{{ $t('save') }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-title v-else>Label Editor</v-card-title>
    <v-card-text class="editor">
      <v-text-field
        :label="$t('text')"
        v-model="text"
        class="mt-4 remove-space"
      ></v-text-field>
      <v-subheader>{{ $t('color') }}</v-subheader>
      <v-color-picker
        class="mx-auto"
        v-model="color"
        hide-inputs
        show-swatches
        :swatches="swatches"
      ></v-color-picker>
      <v-combobox
        class="mt-4 remove-space"
        v-model="automaticallyTags"
        :label="$t('tags')"
        :items="tags"
        multiple
        hide-selected
        small-chips
      ></v-combobox>
      <div class="button-area d-flex mt-auto mb-0">
        <v-btn color="error" @click="deleteLabel">{{ $t('delete') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveLabel">{{ $t('save') }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import firebase from '@/firebase';

import { firestore } from 'firebase';
import { swatches as _swatches } from '@/libs/globalConstVariables';

@Component
export default class LabelEditor extends Vue {
  @Prop({ required: true })
  public label!: {
    id: string;
    color: string;
    text: string;
    tags: string[];
    appendDate: firebase.firestore.Timestamp;
  };

  @Prop()
  public isSmartphoneWidth!: boolean;

  public color: string = this.label.color;
  public text: string = this.label.text;
  public tags: string[] = [];
  public automaticallyTags: string[] = this.label.tags;
  public swatches = _swatches;

  public created() {
    this.fetchTags();
  }

  public saveLabel() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('labels')
      .doc(this.label.id)
      .set(
        {
          color: this.color,
          text: this.text,
          tags: this.automaticallyTags,
        },
        { merge: true }
      )
      .then(() => {
        this.$emit('close');
      });
  }

  public deleteLabel() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('labels')
      .doc(this.label.id)
      .delete()
      .then(() => {
        this.$emit('close');
      });
  }

  private fetchTags() {
    const currentUserUID = firebase.auth().currentUser!.uid;
    this.tags = [];
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .collection('tags')
      .onSnapshot((tags) => {
        tags.forEach((tag) => {
          this.tags.push('#' + tag.data().text);
        });
      });
  }
}
</script>

<style lang="scss">
.editor-root-card,
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.remove-space {
  flex: none;
}
</style>

<i18n>
{
  "en": {
    "text": "Label Name",
    "color": "Color",
    "tags": "Tags that automatically attach this label",
    "save": "Save",
    "delete": "Delete"
  },
  "jp": {
    "text": "ラベル名",
    "color": "色",
    "tags": "自動的にラベルを付与するタグ",
    "save": "保存",
     "delete": "削除"
  }
}
</i18n>
