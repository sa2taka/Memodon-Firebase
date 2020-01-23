<template>
  <img class="media-gallery_thumbnail" v-lazy="previewUrl" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TwitterMedia as ITwitterMedia } from '@/types/memo';

@Component({})
export default class Twittermedia extends Vue {
  @Prop({ required: true })
  media!: ITwitterMedia;

  public get previewUrl() {
    return this.media.media_url_https + '?name=thumb';
  }
}
</script>

<style lang="scss">
.media-gallery {
  &_thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
