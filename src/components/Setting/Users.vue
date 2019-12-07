<template>
  <div id="account" class="mt-4">
    <v-subheader>
      {{ $t('main-account') }}
    </v-subheader>
    <user-info :user="mainUser"></user-info>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import User, { UserState } from '@/store/modules/user';

import UserInfo from '@/components/Setting/UserInfo.vue';

@Component({
  components: {
    UserInfo,
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
    "openInfo": "Twitterのユーザーページを開く"
  },
  "en": {
    "main-account": "Main Account",
    "openInfo": "Open twitter user page"
  }
}
</i18n>
