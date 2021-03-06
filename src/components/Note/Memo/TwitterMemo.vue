<template>
  <v-col>
    <user :userRef="memo.user"></user>
    <v-divider class="mt-2"></v-divider>
    <p class="mx-3 mt-2 memo-content" v-html="html(memo.text)"></p>
  </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TwitterMemo as ITwitterMemo } from '@/types/memo';

import User from '@/components/Note/Memo/User.vue';

@Component({
  components: { User },
})
export default class TwitterMemo extends Vue {
  @Prop({ required: true })
  public memo!: ITwitterMemo;

  private html(text: string) {
    let html = text;

    this.memo.entities.urls.forEach((url) => {
      html = html.replace(
        url.url,
        `<a href="${this.escapeHtml(
          url.url
        )}" target="_blank">${this.escapeHtml(url.display_url)}</a>`
      );
    });

    this.memo.entities.hashtags.forEach((tag) => {
      if (tag === 'メモ' || tag.toLowerCase() === 'memo') {
        return;
      }
      html = html.replace(`#${tag}`, this.generateTagLink(tag));
    });

    return html;
  }

  private escapeHtml(str: string) {
    let escaped = str;
    escaped = escaped.replace(/&/g, '&amp;');
    escaped = escaped.replace(/>/g, '&gt;');
    escaped = escaped.replace(/</g, '&lt;');
    escaped = escaped.replace(/"/g, '&quot;');
    escaped = escaped.replace(/'/g, '&#x27;');
    escaped = escaped.replace(/`/g, '&#x60;');
    return escaped;
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
