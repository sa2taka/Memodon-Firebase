<template>
  <v-row class="account-info mt-4">
    <v-col cols="auto" class="ml-0">
      <v-avatar size="64">
        <v-img :src="user.iconUrl"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="auto" class="account-info__username ml-2 mr-auto">
      <h3 v-html="user.displayName"></h3>
      <div class="grey--text">{{ provider }}@{{ user.userName }}</div>
    </v-col>

    <v-col class="account-info__gotoInfo ml-2" cols="auto">
      <v-btn :color="providerColor" @click="openUserPage">
        {{ $t('openInfo') }}
        <v-icon small>fa-arrow-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GeneralUser } from '@/types/generalUser';

@Component
export default class Users extends Vue {
  @Prop({ required: true })
  private user!: GeneralUser;

  private openUserPage() {
    location.href = this.userInfoPage;
  }

  private get userInfoPage() {
    if (this.user.provider) {
      if (this.user.provider === 'twitter.com') {
        return `https://twitter.com/${this.user.userName}`;
      }
      return `https://${this.user.provider}/@${this.user.userName}`;
    } else {
      return `https://twitter.com/${this.user.userName}`;
    }
  }

  private get provider() {
    if (this.user.provider) {
      return this.user.provider;
    } else {
      return '';
    }
  }

  private get providerColor() {
    if (this.user.provider) {
      if (this.user.provider === 'twitter.com') {
        return '#1da1f2';
      }
      return 'secondary';
    } else {
      return '#1da1f2';
    }
  }
}
</script>

<style lang="scss" scoped>
#account {
  width: 90%;
}
</style>

<i18n>
{
  "jp": {
    "openInfo": "アカウントページを開く"
  },
  "en": {
    "openInfo": "Open account page"
  }
}
</i18n>
