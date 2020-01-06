<template>
  <div id="account" class="mt-4">
    <v-subheader>{{ $t('main-account') }}</v-subheader>
    <user-info :user="mainUser"></user-info>

    <v-divider></v-divider>

    <v-subheader>{{ $t('sub-account') }}</v-subheader>

    <user-info
      :user="subUser"
      v-for="subUser in subUsers"
      :key="subUser.uid"
    ></user-info>

    <add-account-buttons></add-account-buttons>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import User, { UserState } from '@/store/modules/user';

import UserInfo from '@/components/Setting/UserInfo.vue';
import AddAccountButtons from '@/components/Setting/AddAccountButtons.vue';
import { GeneralUser } from '@/types/generalUser';
import firebase from '@/firebase';

@Component({
  components: {
    UserInfo,
    AddAccountButtons,
  },
})
export default class Users extends Vue {
  private mainUser: UserState = User;
  private subUsers: GeneralUser[] = [];

  public created() {
    this.subscribeUser();
    this.subscribeSubUser();
  }

  private subscribeUser() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('user/')) {
        this.mainUser = User;
      }
    });
  }

  private subscribeSubUser() {
    const currentUser = User;

    if (currentUser.uid === '') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          return this.fetchSubUsers(user.uid);
        }
      });
    } else {
      return this.fetchSubUsers(currentUser.uid);
    }
  }

  private fetchSubUsers(uid: string) {
    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('subusers')
      .get()
      .then((snapshots) => {
        if (snapshots.empty) {
          return;
        }
        this.subUsers = [];
        snapshots.forEach((snapshot) => {
          const data = snapshot.data();
          for (const user of Object.values(data)) {
            this.subUsers.push(user as GeneralUser);
          }
        });
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
