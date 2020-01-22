<template>
  <v-col> </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TwitterMedia as ITwitterMedia } from '@/types/memo';

@Component({})
export default class TwitterMedia extends Vue {
  @Prop({ required: true })
  media!: TwitterMedia[];
}
</script>

<style lang="scss"></style>
