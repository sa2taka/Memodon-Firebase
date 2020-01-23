<template>
  <img class="media-gallery_thumbnail" v-lazy="media.preview_url" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  MastodonMedia as IMastodonMedia,
  isMastodonMedia,
  isTwitterMedia,
} from '@/types/memo';

@Component({})
export default class MastodonMedia extends Vue {
  @Prop({ required: true })
  media!: IMastodonMedia;
}
</script>

<style lang="scss">
.media-gallery {
  &_thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-sizing: content-box;
  }
}
</style>
