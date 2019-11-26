<template>
  <v-row id="note">
    <memo
      :text="memo.text"
      v-for="memo in note"
      :key="memo.providerId + memo.id"
    ></memo>
  </v-row>
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

  public created() {}
}
</script>

<style lang="scss"></style>
