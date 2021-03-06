<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title
        @click="$router.push('/')"
        class="headline text-uppercase"
      >
        <span class="navbar-title">Memodon</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <unauth-menu v-if="!isSignin"></unauth-menu>
      <signing-menu v-else></signing-menu>
    </v-app-bar>

    <v-content id="main">
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import UnauthMenu from '@/components/NavBar/UnauthMenu.vue';
import SigningMenu from '@/components/NavBar/SigningMenu.vue';
import { getRedirectResult } from '@/libs/signinWithTwitter';

import Theme from '@/store/modules/theme';
import User, { UserState } from '@/store/modules/user';
import registerStore from '@/libs/storeRegister';

@Component({
  components: {
    UnauthMenu,
    SigningMenu,
  },
})
export default class App extends Vue {
  public isDark: boolean = false;
  private user: UserState = User;
  private storageStateEntity: any = null;

  public async created() {
    await registerStore();
    this.setTheme();
    this.subscribeTheme();
    this.subscribeUser();
    await getRedirectResult();
  }
  @Watch('isDark')
  public changedTheme(isDark: boolean) {
    this.updateTheme(isDark);
  }

  public get isSignin() {
    return this.user.isSignin;
  }

  private setTheme() {
    this.isDark = Theme.theme === 'dark';
  }

  private subscribeTheme() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'theme/setTheme') {
        this.isDark = mutation.payload === 'dark';
      }
    });
  }

  private updateTheme(isDark: boolean) {
    this.$vuetify.theme.dark = isDark;
    Theme.setTheme(isDark ? 'dark' : 'light');
  }

  private subscribeUser() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('user/')) {
        this.user = User;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
#main {
  width: 90%;
  position: relative;
  margin: 0 auto;
}
.center-switch {
  position: relative;
  top: 12px;
  margin-left: 4px;
}
.navbar-title {
  user-select: none;
  cursor: pointer;
}
</style>
