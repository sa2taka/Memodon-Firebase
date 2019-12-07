<template>
  <div id="setting">
    <div class="my-3 grey--text lighten-2 setting-title">
      <h1>{{ $t('settings') }}</h1>
    </div>
    <v-tabs centered v-model="tab">
      <v-tab>{{ $t('account') }}</v-tab>
      <v-tab>{{ $t('users') }}</v-tab>
      <v-tab>{{ $t('tags') }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <my-account></my-account>
      </v-tab-item>
      <v-tab-item>
        <users></users>
      </v-tab-item>
      <v-tab-item>
        <labels></labels>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MyAccount from '@/components/Setting/MyAccount.vue';
import Users from '@/components/Setting/Users.vue';
import Labels from '@/components/Setting/Labels.vue';

@Component({
  components: {
    MyAccount,
    Users,
    Labels,
  },
})
export default class Settings extends Vue {
  private tab: any = null;
}
</script>

<style lang="scss" scoped>
.setting-title {
  text-align: center;
}
</style>
