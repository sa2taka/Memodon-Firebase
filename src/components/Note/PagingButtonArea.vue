<template>
  <v-row>
    <v-btn @click="$emit('prev')" v-show="!isFirstPage">{{ $t('prev') }}</v-btn>
    <v-spacer />
    <v-btn @click="$emit('next')" v-show="!isLastPage" :loading="fetching">{{
      $t('next')
    }}</v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { uniq } from '@/libs/util';

@Component
export default class PagingButtonArea extends Vue {
  @Prop()
  isLastPage!: boolean;
  @Prop()
  isFirstPage!: boolean;
  @Prop()
  fetching!: boolean;
}
</script>

<style lang="scss" scoped></style>

<i18n>
{
  "en": {
    "prev": "Prev",
    "next": "Next"
  },
  "jp": {
    "prev": "前へ",
    "next": "次へ"
  }
}
</i18n>
