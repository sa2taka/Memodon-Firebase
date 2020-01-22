<template>
  <v-col></v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MastodonMedia as IMastodonMedia } from '@/types/memo';

@Component({})
export default class MastodonMediaArea extends Vue {
  media!: IMastodonMedia[];
}
</script>

<style lang="scss"></style>
