<template>
  <div id="note">
    <memo
      :memo="memo"
      v-for="memo in note"
      :key="memo.providerId + memo.id"
      class="memo"
    ></memo>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Memo from '@/components/Note/Memo/Memo.vue';
import { Memo as IMemo } from '@/types/memo';
// @ts-ignore
import muuri from 'muuri';

@Component({
  components: { Memo },
})
export default class Note extends Vue {
  @Prop({ required: true })
  public note: Array<IMemo> | undefined;
  private grid: any;

  public mounted() {
    this.setGridRow();
    // メモの中にあるタグがクリックされたときに、そのタグを検索する画面へ移るようなリスナーを登録
    // メモの内容が可変であるため、どうしてもここに置かなきゃいけない
    this.registerMemoTagClickListener();
  }

  private registerMemoTagClickListener() {
    // 複数回登録されないようにdocumentに一回だけ登録する
    // onClickでもいいけど
    document.addEventListener('click', (event) => {
      const elm = event.target as HTMLElement;
      if (elm.className === 'memo-tag') {
        this.$router.push(
          `/note?tag=${encodeURIComponent(elm.innerHTML.replace('#', ''))}`
        );
      }
    });
  }

  private setGridRow() {
    const memos = document.querySelectorAll('.memo');

    memos.forEach((memo) => {
      const height = memo.scrollHeight;
      memo.setAttribute(
        'style',
        `grid-row: span ${Math.ceil(height / 20) + 2};`
      );
    });
  }
}
</script>

<style lang="scss" scoped>
#note {
  display: grid;
  grid-auto-rows: 20px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.memo {
  min-width: 320px;
}
</style>
