<template>
  <nav-bar-menu :menu="menu" @input="menu = $event">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          <signin-twitter-button
            :text="true"
            @click="menu = false"
          ></signin-twitter-button>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </nav-bar-menu>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import NavBarMenu from '@/components/NavBar/NavBarMenu.vue';
import SigninTwitterButton from '@/components/Molecules/SigninTwitterButton.vue';
import theme from '@/store/modules/theme';

@Component({
  components: {
    NavBarMenu,
    SigninTwitterButton,
  },
})
export default class UnauthMenu extends Vue {
  private menu = false;
}
</script>

<style lang="scss" scoped></style>
