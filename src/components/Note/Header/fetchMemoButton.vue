<template>
  <v-btn color="secondary">
    <v-icon small class="mr-2">fa-redo</v-icon>
    {{ $t('updateMemo') }}
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class fetchMemoButton extends Vue {}
</script>

<style lang="scss" scoped></style>

<i18n>
{
  "us": {
    "updateMemo": "Update Memo"
  },
  "jp": {
    "updateMemo": "メモを更新する"
  }
}
</i18n>
