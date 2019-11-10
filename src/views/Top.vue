<template>
  <v-container justify="center" mt-9>
    <v-row justify="center" align="center" class="flex-row-reverse">
      <v-col cols="12" sm="12" md="4">
        <v-row justify="center" class="mt-10">
          <MainTitle></MainTitle>
          <signin-twitter-button></signin-twitter-button>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-card>
          HogeHoge FugaFuga This display note.
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainTitle from '@/components/Top/MainTitle.vue';
import SigninTwitterButton from '@/components/Molecules/SigninTwitterButton.vue';
@Component({
  components: {
    MainTitle,
    SigninTwitterButton,
  },
})
export default class Top extends Vue {}
</script>

<style lang="scss"></style>
