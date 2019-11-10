<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn text color="primary" v-on="on">
        <i :class="`flag-icon flag-icon-${selected}`"></i>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="name in nations" :key="name" @click="setLang(name)">
        <i :class="`flag-icon flag-icon-${name}`"></i>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

@Component
export default class LocaleSelection extends Vue {
  // lang: nation name
  public nations = ['jp', 'us'];
  public selected = 'en';

  public created() {
    this.selected = this.$i18n.locale;
  }

  public setLang(locale: string) {
    this.selected = locale;
    this.$i18n.locale = locale;
  }
}
</script>

<style lang="scss" scoped></style>
