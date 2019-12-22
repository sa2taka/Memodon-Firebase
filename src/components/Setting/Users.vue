<template>
  <div id="account" class="mt-4">
    <v-subheader>{{ $t('main-account') }}</v-subheader>
    <user-info :user="mainUser"></user-info>

    <v-divider></v-divider>

    <v-subheader>{{ $t('sub-account') }}</v-subheader>

    <add-account-buttons></add-account-buttons>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import User, { UserState } from '@/store/modules/user';

import UserInfo from '@/components/Setting/UserInfo.vue';
import AddAccountButtons from '@/components/Setting/AddAccountButtons.vue';

@Component({
  components: {
    UserInfo,
    AddAccountButtons,
  },
})
export default class Users extends Vue {
  private mainUser: UserState = User;

  public created() {
    this.subscribeUser();
  }

  private subscribeUser() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('user/')) {
        this.mainUser = User;
      }
    });
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
    "main-account": "メインアカウント",
    "sub-account": "サブアカウント",
    "openInfo": "Twitterのユーザーページを開く"
  },
  "en": {
    "main-account": "Main Account",
    "sub-account": "Sub Accounts",
    "openInfo": "Open twitter user page"
  }
}
</i18n>
