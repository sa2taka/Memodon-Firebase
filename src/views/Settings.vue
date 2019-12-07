<template>
  <div id="setting">
    <div class="my-3 grey--text lighten-2 setting-title">
      <h1>{{ $t('settings') }}</h1>
    </div>
    <v-tabs centered="">
      <v-tab>{{ $t('account') }}</v-tab>
      <v-tab>{{ $t('users') }}</v-tab>
      <v-tab>{{ $t('tags') }}</v-tab>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>

<style lang="scss" scoped>
.setting-title {
  text-align: center;
}
</style>
