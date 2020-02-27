<template>
  <div d-flex class="label-list">
    <v-chip
      :color="label.color"
      small
      v-for="label in labels"
      :key="label.id"
      class="ml-2"
      >{{ label.text }}</v-chip
    >
    <!-- insert span so that order is not broken -->
    <span class="ml-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-chip
            color="success"
            link
            small
            v-on="on"
            @click.stop="dialog = true"
          >
            <v-icon x-small>fa-pen</v-icon>
          </v-chip>
        </template>
        <span>{{ $t('edit-label') }}</span>
      </v-tooltip>
      <v-dialog v-model="dialog" max-width="480px">
        <v-card>
          <v-card-title primary-title>{{ $t('edit-label') }}</v-card-title>

          <v-card-text>
            <label-selection :value="selectLabels" @input="updateMemoLabel" />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="primary" text @click="dialog = false">
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Labels from '@/store/modules/labels';
import { Label } from '@/types/label';
import LabelSelection from '@/components/Molecules/LabelSelection.vue';
import firebase from '@/firebase';

@Component({
  components: {
    LabelSelection,
  },
})
export default class LabelList extends Vue {
  @Prop({ required: true })
  labels!: Label[];
  @Prop({ required: true })
  specifiedLabels!: Label[];
  @Prop({ required: true })
  memoId!: string;
  dialog = false;

  selectLabels: Label[] = [];

  created() {
    this.selectLabels = this.specifiedLabels;
  }

  updateMemoLabel(value: Label[]) {
    this.selectLabels = value;
    const id = firebase.auth().currentUser!.uid;
    const labelRefs = this.generateLabelRefs(this.selectLabels);
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('memos')
      .doc(this.memoId)
      .set({ labels: labelRefs }, { merge: true });
  }

  generateLabelRefs(labels: Label[]) {
    const id = firebase.auth().currentUser!.uid;
    return labels.map((label) => {
      return firebase
        .firestore()
        .collection('users')
        .doc(id)
        .collection('labels')
        .doc(label.id);
    });
  }
}
</script>

<style lang="scss">
.label-list {
  min-height: 26px;
}
</style>

<i18n>
{
  "en": {
    "edit-label": "Edit Label",
    "label": "Label",
    "close": "Close"
  },
  "jp": {
    "edit-label": "ラベルの編集",
    "label": "ラベル",
    "close": "閉じる"
  }
}
</i18n>
