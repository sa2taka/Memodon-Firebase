<template>
  <header>
    <fetch-memo-button class="fetch-memo-button"></fetch-memo-button>
    <memo-searcher
      class="mt-4"
      :tagsRef="tagsRef"
      :userRef="userRef"
    ></memo-searcher>
  </header>
</template>

<script lang="ts">
import { Component, Watch, Emit, Prop, Vue } from 'vue-property-decorator';
import { uniq } from '@/libs/util';

import memoSearcher from '@/components/Note/Header/memoSearcher.vue';
import fetchMemoButton from '@/components/Note/Header/fetchMemoButton.vue';

import Query from '@/store/modules/memoSearchQuery';

@Component({
  components: {
    memoSearcher,
    fetchMemoButton,
  },
})
export default class NotePageHeader extends Vue {
  @Prop({ required: true })
  public tagsRef!: firebase.firestore.CollectionReference;
  @Prop()
  public userRef?: firebase.firestore.DocumentReference;
}
</script>

<style lang="scss" scoped>
.fetch-memo-button {
  margin-right: 0;
  margin-left: auto;
  display: block;
}
</style>
