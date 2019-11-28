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
  }

  private setGridRow() {
    const memos = document.querySelectorAll('.memo');

    memos.forEach((memo) => {
      const height = memo.scrollHeight;
      memo.setAttribute(
        'style',
        `grid-row: span ${Math.ceil(height / 20) + 1};`
      );
    });
  }
}
</script>

<style lang="scss" scoped>
#note {
  display: grid;
  grid-auto-rows: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.memo {
  min-width: 240px;
}
</style>
