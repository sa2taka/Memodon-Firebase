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
    getAccessToken(this.code)
      .then(() => {
        close();
      })
      .catch(() => {
        close();
      });
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
  "confirmAuthorizeInfo": "認可情報確認・タグ取得中...(この作業は時間がかかる場合があります)"
},
"en": {
  "confirmAuthorizeInfo": "Confirming authorize information, Fetching tags...(This process can take serveral minutes)"
}
}
</i18n>
