<template>
  <v-container class="url-field instance">
    <v-row class="mx-auto">{{ $t('confirmAuthorizeInfo') }}</v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getAccessToken } from '@/libs/mastodonUser';

@Component
export default class GetMastodonToken extends Vue {
  public created() {
    getAccessToken(this.code);
  }

  private get code(): string {
    const m = window.location.search.match(/code=(.+)/);
    if (!m) {
      throw Error;
    }

    const code = m[1];

    if (!code) {
      throw Error;
    }

    return code;
  }
}
</script>

<style lang="scss" scoped></style>

<i18n>
{
"jp": {
  "confirmAuthorizeInfo": "認可情報を確認中です"
},
"en": {
  "confirmAuthorizeInfo": "Confirming Authorize Information"
}
}
</i18n>
