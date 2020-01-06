<template>
  <v-col>
    <user :userRef="memo.user"></user>
    <v-divider class="mt-2"></v-divider>
    <p class="mx-3 mt-2 memo-content" v-html="memo.text"></p>
  </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MastodonMemo as IMastodonMemo } from '@/types/memo';

import User from '@/components/Note/Memo/User.vue';

@Component({
  components: { User },
})
export default class TwitterMemo extends Vue {
  @Prop({ required: true })
  public memo!: IMastodonMemo;

  private html(text: string) {
    let html = text;

    this.memo.entities.hashtags.forEach((tag) => {
      if (tag === 'メモ' || tag.toLowerCase() === 'memo') {
        return;
      }
      html = html.replace(`#${tag}`, this.generateTagLink(tag));
    });

    return html;
  }

  private generateTagLink(tag: string) {
    return `<a class="memo-tag">#${tag}</a>`;
  }
}
</script>

<style lang="scss">
.memo-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.3em;
}
</style>
