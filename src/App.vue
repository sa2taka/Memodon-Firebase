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
import Theme from '@/store/modules/theme';
import User, { UserState } from '@/store/modules/user';
import UnauthMenu from '@/components/NavBar/UnauthMenu.vue';
import SigningMenu from '@/components/NavBar/SigningMenu.vue';
import { getRedirectResult } from '@/libs/signinWithTwitter';

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
    await this.initializeStore();
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

  // initialize store

  private async initializeStore() {
    if (!this.storageState) {
      return;
    }

    this.setTheme();
    await this.setUser();
  }

  private setTheme() {
    Theme.setTheme(this.storageState.theme.theme);
    this.isDark = this.storageState.theme.theme === 'dark';
  }

  private async setUser() {
    User.setInfo(this.storageState.user);
    await User.signIn();
  }

  private get storageState(): any {
    if (this.storageStateEntity) {
      return this.storageStateEntity;
    }

    try {
      this.storageStateEntity = JSON.parse(localStorage.memodonState);
    } catch (e) {
      this.storageStateEntity = null;
    }
    return this.storageStateEntity;
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
