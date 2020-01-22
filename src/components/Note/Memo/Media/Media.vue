<template>
  <v-col> </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MastodonMedia, TwitterMedia } from '@/types/memo';

@Component({})
export default class Media extends Vue {
  @Prop({ required: true })
  media!: MastodonMedia | TwitterMedia;
}
</script>

<style lang="scss"></style>
