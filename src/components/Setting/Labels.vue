<template>
  <div id="labels" class="mt-4 mb-3">
    <v-subheader>{{ $t('label') }}</v-subheader>
    <add-label-button class="primary"></add-label-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AddLabelButton from '@/components/Setting/AddLabelButton.vue';

@Component({
  components: {
    AddLabelButton,
  },
})
export default class Labels extends Vue {}
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
