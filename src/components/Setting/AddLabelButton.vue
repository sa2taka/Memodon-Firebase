<template>
  <v-btn>{{ $t('addLabel') }}</v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AddLabelButton extends Vue {}
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
