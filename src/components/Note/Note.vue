<template>
  <div id="note">
    <transition-group name="memo-list" tag="p" appear>
      <memo
        :memo="memo"
        v-for="memo in note"
        :key="memo.providerId + memo.id"
        class="memo"
      ></memo>
    </transition-group>
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
}
</script>

<style lang="scss">
// transition-groupを利用するため > * を付与している
#note > * {
  display: grid;
  grid-auto-rows: 20px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.memo {
  min-width: 320px;
  display: inline-block;
  transition: all 0.4s;
}

.memo-list {
  &-enter {
    opacity: 0;
    transform: translateX(-20px);
  }

  &-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }

  &-leave-active {
    position: absolute;
  }
}
</style>
