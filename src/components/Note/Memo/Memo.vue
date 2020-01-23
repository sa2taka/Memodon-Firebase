<template>
  <v-card class="mx-2 mt-4 pa-3">
    <twitter-memo :memo="memo" v-if="isTwitterMemo(memo)"></twitter-memo>
    <mastodon-memo :memo="memo" v-else></mastodon-memo>
    <media-area :memo="memo"></media-area>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import TwitterMemo from '@/components/Note/Memo/TwitterMemo.vue';
import MastodonMemo from '@/components/Note/Memo/MastodonMemo.vue';
import MediaArea from '@/components/Note/Memo/Media/MediaArea.vue';
import { Memo as IMemo, isTwitterMemo } from '@/types/memo';

import MemoSearchQuery from '@/store/modules/memoSearchQuery';

@Component({
  components: { TwitterMemo, MastodonMemo, MediaArea },
})
export default class Memo extends Vue {
  @Prop({ required: true })
  public memo!: IMemo;
  public mounted() {
    this.setGridRow();
    this.registerMemoTagClickListener();
  }

  public isTwitterMemo(memo: TwitterMemo | MastodonMemo) {
    return isTwitterMemo(memo);
  }

  private registerMemoTagClickListener() {
    this.$el.querySelectorAll('.memo-tag').forEach((elm) => {
      elm.addEventListener('click', () => {
        MemoSearchQuery.setWords([elm.innerHTML]);
      });
    });
  }

  private setGridRow() {
    const height = this.$el.scrollHeight;
    this.$el.setAttribute('style', `grid-row: span ${Math.ceil(height / 20)};`);
  }
}
</script>

<style lang="scss">
.memo-paper {
  background-image: linear-gradient(
    180deg,
    rgba(204, 204, 204, 0) 0%,
    rgba(204, 204, 204, 0) 98.5%,
    #444444 100%
  );
  background-repeat: repeat-y;
  background-size: 100% 2.4em;
  line-height: 2.4;
}
</style>
