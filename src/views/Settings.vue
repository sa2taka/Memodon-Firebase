<template>
  <div id="setting">
    <v-btn text class="backToNote mt-2" @click="$router.push({ name: 'note' })">
      <v-icon small class="mr-1">fa-arrow-left</v-icon>
      <p>{{ $t('backToNote') }}</p>
    </v-btn>

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
        <v-row justify="center">
          <my-account></my-account>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row justify="center">
          <users></users>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row justify="center">
          <labels></labels>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
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

  public mounted() {
    this.switchSetting();
  }

  @Watch('$route')
  private onChangeRouter() {
    this.switchSetting();
  }

  private switchSetting() {
    switch (this.$route.name) {
      case 'setting-account':
        this.tab = 0;
        this.$router.replace({ name: 'setting' });
        break;
      case 'setting-users':
        this.tab = 1;
        this.$router.replace({ name: 'setting' });
        break;
      case 'setting-tags':
        this.tab = 2;
        this.$router.replace({ name: 'setting' });
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-title {
  text-align: center;
}

.backToNote {
  display: flex;
  align-items: center;

  & * {
    height: 1.4em;
    margin: auto 0;
  }
}
</style>

<i18n>
{
"jp": {
  "backToNote": "メモ帳へ戻る"
},
"en": {
  "backToNote": "Back to note"
}
}
</i18n>
