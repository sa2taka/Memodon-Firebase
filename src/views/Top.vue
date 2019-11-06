<template>
  <v-layout justify-center mt-9>
    <MainTitle></MainTitle>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainTitle from '@/components/Top/MainTitle.vue';
@Component({
  components: {
    MainTitle,
  },
})
export default class Top extends Vue {}
</script>

<style lang="scss"></style>
