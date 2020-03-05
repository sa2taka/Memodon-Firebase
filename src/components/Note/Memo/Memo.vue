<template>
  <v-lazy v-model="isActive" min-height="280">
    <v-card class="mx-2 mt-4 pa-3">
      <label-list
        :labels="labels"
        :specifiedLabels="specifiedLabels"
        :memoId="memo.firebaseId"
      ></label-list>
      <twitter-memo :memo="memo" v-if="isTwitterMemo(memo)"></twitter-memo>
      <mastodon-memo :memo="memo" v-else></mastodon-memo>
      <ogp :url="firstUrl" v-if="firstUrl" @display="setGridRow(true)"></ogp>
      <media-area :memo="memo"></media-area>
    </v-card>
  </v-lazy>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import TwitterMemo from '@/components/Note/Memo/TwitterMemo.vue';
import MastodonMemo from '@/components/Note/Memo/MastodonMemo.vue';
import MediaArea from '@/components/Note/Memo/Media/MediaArea.vue';
import Ogp from '@/components/Note/Memo/Media/Ogp.vue';
import LabelList from '@/components/Note/Memo/LabelList.vue';
import { Memo as IMemo, isTwitterMemo } from '@/types/memo';

import firebase from '@/firebase';

import MemoSearchQuery from '@/store/modules/memoSearchQuery';
import Labels from '@/store/modules/labels';
import { Label } from '@/types/label';

@Component({
  components: { TwitterMemo, MastodonMemo, MediaArea, Ogp, LabelList },
})
export default class Memo extends Vue {
  @Prop({ required: true })
  public memo!: IMemo;
  @Prop()
  public visible!: boolean;

  isActive = false;

  public mounted() {
    this.registerMemoTagClickListener();
    this.setGridRow();
  }

  @Watch('visible')
  private onChangeVisible() {
    this.setGridRow();
  }

  public isTwitterMemo(memo: TwitterMemo | MastodonMemo) {
    return isTwitterMemo(memo);
  }

  public get firstUrl() {
    if (isTwitterMemo(this.memo)) {
      if (this.memo.entities.urls[0]) {
        return this.memo.entities.urls[0].expanded_url;
      } else {
        return null;
      }
    } else {
      const matches = (this.memo.text as string).match(
        /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
      );
      if (matches) {
        return matches[0].toString();
      } else {
        return null;
      }
    }
  }

  public setGridRow(containsOgp?: boolean) {
    if (this.$el.scrollHeight !== 0) {
      // Height is changed with hard-coded value because the display collapses when ogp is displayed
      const height = containsOgp
        ? this.$el.scrollHeight + 108
        : this.$el.scrollHeight;
      this.$el.setAttribute(
        'style',
        `grid-row: span ${Math.ceil(height / 20)};height: ${height}px;`
      );
    }
  }

  public get labels(): Label[] {
    return Labels.labels.filter(
      (label) => this.isSpecifiedLabel(label) || this.isCategoryLabel(label)
    );
  }

  public get specifiedLabels(): Label[] {
    return Labels.labels.filter((label) => this.isSpecifiedLabel(label));
  }

  private isSpecifiedLabel(label: Label) {
    const specifiedLabels = this.memo.labels || [];

    return specifiedLabels.some((sl) => sl.id === label.id);
  }

  private isCategoryLabel(label: Label) {
    const tags = this.memo.entities.hashtags;
    return tags.some((tag) => label.tags.includes(`#${tag}`));
  }

  private registerMemoTagClickListener() {
    this.$el.querySelectorAll('.memo-tag').forEach((elm) => {
      elm.addEventListener('click', () => {
        MemoSearchQuery.setWords([elm.innerHTML]);
      });
    });
  }
}
</script>

<style lang="scss"></style>
