<template>
  <nav-bar-menu :menu="menu" @input="menu = $event">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          <v-btn text @click="singinWithTwitter">
            <v-icon color="#1DA1F2" v-html="'$vuetify.icons.twitter'"></v-icon>
            <p class="ml-1 my-auto">Sign in with Twitter</p>
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item>
      <template v-slot:default="{ active, toggle }">
        <v-list-item-content>
          <v-list-item-title>Dark Mode</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <dark-theme-switch></dark-theme-switch>
        </v-list-item-action>
      </template>
    </v-list-item>
  </nav-bar-menu>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import NavBarMenu from '@/components/NavBar/NavBarMenu.vue';
import DarkThemeSwitch from '@/components/Molecules/darkThemeSwitch.vue';
import theme from '@/store/modules/theme';
import { signinWithPopup, redirectSigninPage } from '@/libs/signinWithTwitter';
import { MinSmallWidth } from '@/libs/globalConstVariables';

@Component({
  components: {
    NavBarMenu,
    DarkThemeSwitch,
  },
})
export default class UnauthMenu extends Vue {
  private BoundaryWidth = MinSmallWidth;
  private menu = true;

  private singinWithTwitter() {
    if (this.isSmartphone) {
      redirectSigninPage();
    } else {
      this.menu = false;
      signinWithPopup();
    }
  }

  private get isSmartphone() {
    return window.innerWidth < this.BoundaryWidth;
  }
}
</script>

<style lang="scss" scoped></style>
