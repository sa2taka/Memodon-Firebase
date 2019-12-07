<template>
  <nav-bar-menu :menu="false">
    <v-subheader class="mb-2">
      <div class="account-title">Account</div>
      <div class="ml-auto mr-0">
        <v-btn depressed small color="accent" @click="signout">
          <v-icon small left>fa-sign-out-alt</v-icon>
          <p class="my-auto">Signout</p>
        </v-btn>
      </div>
    </v-subheader>
    <v-divider></v-divider>

    <v-list-item @click="$router.push({ name: 'setting-account' })">
      <v-list-item-avatar>
        <v-img :src="user.iconUrl"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-html="user.displayName"></v-list-item-title>
        <v-list-item-subtitle>@{{ user.userName }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item-group>
      <v-subheader>{{ $t('settings') }}</v-subheader>
      <v-list-item
        @click="$router.push({ name: `setting-${item}` })"
        v-for="item in settingsItems"
        :key="item"
      >
        <v-list-item-icon>
          <v-icon small>fa-{{ item }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t(item) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </nav-bar-menu>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import NavBarMenu from '@/components/NavBar/NavBarMenu.vue';
import DarkThemeSwitch from '@/components/Molecules/darkThemeSwitch.vue';
import theme from '@/store/modules/theme';
import User, { UserState } from '@/store/modules/user';

@Component({
  components: {
    NavBarMenu,
    DarkThemeSwitch,
  },
})
export default class SigningMenu extends Vue {
  private user: UserState = User;
  private settingsItems = ['users', 'tags'];

  public created() {
    this.subscribeUser();
  }

  private signout() {
    User.signOut()
      .then(() => {
        this.$router.push({ name: 'top' });
      })
      .catch(() => {
        this.$router.push({ name: 'top' });
      });
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
.account-title {
  font-size: 1.2em;
}
.signout-button {
  position: relative;
  width: 100%;
  text-align: end;
}
</style>
