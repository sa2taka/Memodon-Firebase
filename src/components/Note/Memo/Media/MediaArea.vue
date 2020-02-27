<template>
  <div v-if="media.length !== 0">
    <v-divider></v-divider>
    <div class="media-gallery">
      <div
        v-for="(m, index) in media"
        class="media-gallery_item"
        :style="mediaStyle(index)"
        :key="memo.id + m.id"
      >
        <twitter-media :media="m" v-if="isTwitterMedia(m)"></twitter-media>
        <mastodon-media :media="m" v-else></mastodon-media>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  TwitterMedia as ITwitterMedia,
  MastodonMedia as IMastodonMedia,
  TwitterMemo as ITwitterMemo,
  MastodonMemo as IMastodonMemo,
  isTwitterMemo,
  isTwitterMedia,
} from '@/types/memo';

import MastodonMedia from '@/components/Note/Memo/Media/MastodonMedia.vue';
import TwitterMedia from '@/components/Note/Memo/Media/TwitterMedia.vue';

@Component({
  components: {
    MastodonMedia,
    TwitterMedia,
  },
})
export default class MediaArea extends Vue {
  @Prop({ required: true })
  memo!: ITwitterMemo | IMastodonMemo;

  public get media() {
    if (isTwitterMemo(this.memo)) {
      if (typeof this.memo.entities.media !== 'undefined') {
        return this.memo.extendedEntities.media.length !== 0
          ? this.memo.extendedEntities.media
          : this.memo.entities.media;
      } else {
        return [];
      }
    } else {
      return this.memo.entities.media;
    }
  }

  public isTwitterMedia(media: TwitterMedia | MastodonMedia) {
    return isTwitterMedia(media);
  }

  public mediaStyle(index: number) {
    const length = this.media.length;
    switch (length) {
      case 1:
        return '';
      case 2:
        switch (index) {
          case 0:
            return 'left: auto; top: auto; right: 2px; bottom: auto; width: 50%; height: 100%;';
          case 1:
            return 'left: 2px; top: auto; right: auto; bottom: auto; width: 50%; height: 100%;';
        }
        break;
      case 3:
        switch (index) {
          case 0:
            return 'left: auto; auto; right: 2px; bottom: auto; width: 50%; height: 100%;';
          case 1:
            return 'left: 2px; top: auto; right: auto; bottom: 2px; width: 50%; height: 50%';
          case 2:
            return 'left: 2px; top: 2px; right: auto; bottom: auto; width: 50%; height: 50%;';
        }
        break;
      case 4:
        switch (index) {
          case 0:
            return 'left: auto; top: auto; right: 2px; bottom: 2px; width: 50%; height: 50%;';
          case 1:
            return 'left: 2px; top: auto; right: auto; bottom: 2px; width: 50%; height: 50%;';
          case 2:
            return 'left: auto; top: 2px; right: 2px; bottom: auto; width: 50%; height: 50%;';
          case 3:
            return 'left: 2px; top: 2px; right: auto; bottom: auto; width: 50%; height: 50%;';
        }
        break;
    }
  }
}
</script>

<style lang="scss">
.media-gallery {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 8px;
  height: 160px;
  border-radius: 14px;

  &_item {
    border: none;
    display: block;
    float: left;
    position: relative;
  }
}
</style>
