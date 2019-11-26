<template>
  <div id="note-grid">
    <memo
      class="memo"
      :text="memo.text"
      v-for="memo in note"
      :key="memo.providerId + memo.id"
    ></memo>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Memo from '@/components/Note/Memo.vue';
// @ts-ignore
import muuri from 'muuri';

@Component({
  components: { Memo },
})
export default class Note extends Vue {
  @Prop({ required: true })
  public note: Array<any> | undefined;
  private grid: any;

  public mounted() {
    const memos = document.querySelectorAll('.memo');

    console.log(memos);
    memos.forEach((elm) => {
      const height = elm.scrollHeight;
      elm.setAttribute('style', `grid-row-gap: ${Math.ceil(height / 20)};`);
    });
  }
}
</script>

<style lang="scss">
#note-grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-auto-rows: 20px;
}

.memo {
  min-width: 320px;
}
</style>
