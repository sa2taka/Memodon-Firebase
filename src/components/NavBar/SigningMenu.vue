<template>
  <nav-bar-menu>
    <v-list-item
      @click="
        '';


      "
    >
      <v-list-item-avatar>
        <v-img :src="''"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>とっぷら</v-list-item-title>
        <v-list-item-subtitle>t0p-l1ght</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          <v-btn @click="fetchMemo">fetch memo</v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          <div class="signout-button">
            <v-btn depressed rounded color="primary" @click="signout">
              <v-icon small left>fa-sign-out-alt</v-icon>
              <p class="my-auto">Signout</p>
            </v-btn>
          </div>
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
import { Component, Watch, Vue } from 'vue-property-decorator';
import NavBarMenu from '@/components/NavBar/NavBarMenu.vue';
import DarkThemeSwitch from '@/components/Molecules/darkThemeSwitch.vue';
import theme from '@/store/modules/theme';
@Component({
  components: {
    NavBarMenu,
    DarkThemeSwitch,
  },
})
export default class SigningMenu extends Vue {
  public created() {}

  private signout() {}

  private async fetchMemo() {}
}
</script>

<style lang="scss" scoped>
.signout-button {
  position: relative;
  width: 100%;
  text-align: end;
}
</style>
