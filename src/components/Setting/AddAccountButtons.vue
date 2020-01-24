<template>
  <div class="add-account-buttons my-3">
    <v-btn class="twitter-button ml-2 mr-2 mt-2" width="97%">
      <v-icon small>fa-user-plus</v-icon>
      <span class="mr-auto ml-2">{{ $t('add-twitter') }}</span>
    </v-btn>
    <v-btn
      @click="startMastodonAuth"
      class="mastodon-button ml-2 mr-2 mt-2"
      width="97%"
    >
      <v-icon small>fa-user-plus</v-icon>
      <span class="mr-auto ml-2">{{ $t('add-mastodon') }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { startAuthWithMastodonWindow } from '@/libs/authWithMastodon';

@Component
export default class AddAccountButtons extends Vue {
  public startMastodonAuth() {
    startAuthWithMastodonWindow();
  }
}
</script>

<style lang="scss" scoped>
.add-account-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.twitter-button {
  background: #1da1f2 !important;
  color: white;

  box-sizing: border-box;
}

.mastodon-button {
  background: var(--v-secondary-base) !important;
  color: white;

  box-sizing: border-box;
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
