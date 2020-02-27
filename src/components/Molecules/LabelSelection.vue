<template>
  <v-combobox
    class="mt-4 remove-space"
    :value="value"
    @input="$emit('input', $event)"
    :label="$t('label')"
    :items="userLabels"
    multiple
    hide-selected
    small-chips
  >
    <template v-slot:no-data>
      <v-btn
        @click="$router.push({ name: 'setting-tags' })"
        small
        class="ml-3"
        color="primary"
        >{{ $t('config-label') }}</v-btn
      >
    </template>

    <template v-slot:selection="{ item, parent }">
      <v-chip v-if="item === Object(item)" :color="item.color" small>
        <span class="pr-2">{{ item.text }}</span>
        <v-icon small @click="parent.selectItem(item)">fa-times</v-icon>
      </v-chip>
    </template>

    <template v-slot:item="{ item }">
      <v-chip v-if="item === Object(item)" :color="item.color" small>
        <span class="pr-2">{{ item.text }}</span>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Labels from '@/store/modules/labels';
import { Label } from '@/types/label';

@Component
export default class LabelSelection extends Vue {
  @Prop({ default: () => [] })
  value!: Label[];

  userLabels: Label[] = [];

  created() {
    this.userLabels = Labels.labels;
    this.subscribeLabels();
  }

  subscribeLabels() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('labels')) {
        this.userLabels = state.labels.labels;
      }
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
    "close": "Close",
    "save": "Save",
    "config-label": "Label Setting"
  },
  "jp": {
    "edit-label": "ラベルの編集",
    "label": "ラベル",
    "close": "閉じる",
    "save": "保存",
    "config-label": "ラベル設定"
  }
}
</i18n>
