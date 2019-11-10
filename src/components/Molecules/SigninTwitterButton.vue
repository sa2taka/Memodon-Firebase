<template>
  <v-btn :text="text" @click="singinWithTwitter" class="signin-twitter-button">
    <v-icon v-html="'$vuetify.icons.twitter'"></v-icon>
    <p class="ml-1 my-auto">Sign in with Twitter</p>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { signinWithPopup, redirectSigninPage } from '@/libs/signinWithTwitter';
import { MinSmallWidth } from '@/libs/globalConstVariables';

@Component
export default class SigninTwitterButton extends Vue {
  @Prop()
  public text = false;
  private singinWithTwitter() {
    if (this.isSmartphone) {
      redirectSigninPage();
    } else {
      signinWithPopup();
    }
  }

  private get isSmartphone() {
    return window.innerWidth < MinSmallWidth;
  }
}
</script>

<style lang="scss" scoped>
.signin-twitter-button {
  background: #1da1f2 !important;
  color: white;
}
</style>
