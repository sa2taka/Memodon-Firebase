<template>
  <div class="add-account-buttons my-4">
    <v-btn class="twitter-button">{{ $t('add-twitter') }}</v-btn>
    <v-btn class="mastodon-button ml-4">{{ $t('add-mastodon') }}</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AddAccountButtons extends Vue {}
</script>

<style lang="scss" scoped>
.twitter-button {
  background: #1da1f2 !important;
  color: white;
}

.mastodon-button {
  background: var(--v-secondary-base) !important;
  color: white;
}
</style>

<i18n>
{
  "jp": {
    "add-twitter": "Twitterユーザーを追加する",
    "add-mastodon": "Mastodonユーザーを追加する"
  },
  "en": {
    "add-twitter": "Add Twitter user",
    "add-mastodon": "Add Mastodon user"
  }
}
</i18n>
