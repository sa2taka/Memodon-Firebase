<template>
  <v-container class="url-field instance">
    <v-row class="mx-auto">
      <v-text-field
        placeholder="e.g. mstdn-workers.com"
        outlined
        v-model="baseUrl"
        class="mt-8"
        :loading="isLoading"
      ></v-text-field>
      <v-btn
        color="primary"
        class="ml-2 my-auto"
        :loading="isLoading"
        @click="gotoAuthPage"
        >{{ $t('gotoAuthPage') }}</v-btn
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/firebase';

@Component
export default class AuthWithMastodon extends Vue {
  public baseUrl: string = '';
  public authUrl?: string;
  public isLoading: boolean = false;

  public gotoAuthPage() {
    const authenticateMastodon = firebase
      .functions()
      .httpsCallable('authenticateMastodon');
    this.isLoading = true;

    authenticateMastodon({ uri: this.formatedUrl })
      .then((result) => {
        const { uri, clientId } = result.data;
        this.isLoading = false;

        //Use when obtaining an access token
        sessionStorage.setItem('authMastodonUrl', uri);

        location.href = this.createAuthUrl(uri, clientId);
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  private get formatedUrl() {
    let replaced = this.baseUrl;
    if (replaced === '') {
      replaced = 'https://mstdn-workers.com';
    }
    replaced.replace(/\/+$/, '');
    replaced.replace(/^http:\/\//, 'https://');
    if (!replaced.match(/^https:\/\//)) {
      replaced = 'https://' + replaced;
    }
    return replaced;
  }

  private createAuthUrl(uri: string, clientId: string) {
    const redirectPath = '/auth/mastodon/code';
    const redirectUri = encodeURIComponent(new URL(document.URL).origin);
    const scope = 'read';
    const responseType = 'code';
    const qs = `?response_type=${responseType}&redirect_uri=${redirectUri}${redirectPath}&scope=${scope}&client_id=${clientId}`;
    const authPath = '/oauth/authorize';

    return uri + authPath + qs;
  }
}
</script>

<style lang="scss" scoped>
.url-field {
  width: 600px;
}
</style>

<i18n>
{
"jp": {
  "checkInsntance": "インスタンスを確認する",
  "gotoAuthPage": "認証ページへ進む"
},
"en": {
  "checkInsntance": "Check the insntace",
  "gotoAuthPage": "Step to the authentication page"
}
}
</i18n>
