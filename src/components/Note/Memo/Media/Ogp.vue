<template>
  <transition name="fade">
    <article class="inline-ogp" v-if="visible">
      <div class="inline-ogp_left-bar"></div>
      <figure class="ogp-icon">
        <v-img width="64" height="64" :src="image" />
      </figure>

      <h4 class="mb-0 ogp-title">{{ title }}</h4>
      <p class="mb-0 ogp-description">
        <small>{{ description }}</small>
      </p>
    </article>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  TwitterMemo as ITwitterMemo,
  MastodonMemo as IMastodonMemo,
  isTwitterMemo,
} from '@/types/memo';
import firebase from '@/firebase';

@Component({})
export default class MediaArea extends Vue {
  @Prop({ required: true })
  url!: string;

  public visible = false;
  public siteName: string = '';
  public title: string = '';
  public ogpUrl: string = '';
  public image: string = '';
  public description: string = '';

  public created() {
    const fetchOgp = firebase
      .app()
      .functions('asia-northeast1')
      .httpsCallable('fetchOgp');
    fetchOgp({ url: this.url }).then((ogp: any) => {
      this.siteName = ogp.data['og:site_name'] || '';
      this.title = ogp.data['og:title'] || '';
      this.ogpUrl = ogp.data['og:url'] || this.url;
      this.image = ogp.data['og:image'] || '';
      this.description = ogp.data['og:description'] || '';
      if (
        this.siteName !== '' &&
        this.title !== '' &&
        this.ogpUrl !== '' &&
        this.description !== ''
      ) {
        this.visible = true;
        this.$emit('display');
      }
    });
  }
}
</script>

<style lang="scss">
$top-height: 24px;
$bottom-height: 70px;
.inline-ogp {
  position: relative;
  cursor: pointer;
  width: 100%;
  display: grid;
  grid-template-columns: 24px 70px 1fr;
  grid-template-rows: $top-height $bottom-height;
  grid-template-areas: 'g0 g1 g2' 'g0 g1 g3';

  &_left-bar {
    background-color: rgb(129, 139, 161);
    border-radius: 8px;
    position: absolute;
    width: 4px;
    height: $top-height + $bottom-height;
    z-index: 1;
    margin-right: 20px;
    grid-area: g0;
  }
}

.ogp-title,
.ogp-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.ogp-title {
  height: $top-height;
  color: rgb(125, 212, 201);
  grid-area: g2;
}

.ogp-description {
  height: $bottom-height;
  grid-area: g3;
}

.ogp-icon {
  width: 80px;
  height: 80px;
  overflow: hidden;
  margin-top: 12px;
  margin-right: 6px;
  grid-area: g1;
}
.fade {
  &-enter-active,
  &-leave-active {
    transition: all 0.8s;
  }
  &-enter,
  &-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>
