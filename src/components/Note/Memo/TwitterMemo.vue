<template>
  <v-row>
    <user :userRef="memo.user"></user>
    <v-col>
      <p class="mx-3">{{ memo.text }}</p>
    </v-col>
  </v-row>
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
}
</script>

<style lang="scss"></style>
