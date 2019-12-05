<template>
  <v-btn color="secondary" @click="callToFetchMemo" width="160">
    <transition name="fade">
      <p v-show="!isLoading" class="my-auto fade">
        <v-icon small class="mr-2">fa-redo</v-icon>
        {{ $t('updateMemo') }}
      </p>
    </transition>
    <transition name="fade">
      <p v-show="isLoading" class="my-auto fade">
        <loading :side="30"></loading>
      </p>
    </transition>
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/firebase';

import Loading from '@/components/Atomic/Loading.vue';

@Component({
  components: {
    Loading,
  },
})
export default class fetchMemoButton extends Vue {
  public isLoading = false;
  public callToFetchMemo() {
    const fetchMemo = firebase.functions().httpsCallable('fetchMemo');
    this.isLoading = true;

    fetchMemo().then((result) => {
      this.isLoading = false;
    });
  }
}
</script>

<style lang="scss" scoped>
.fade {
  transition: all 0.3s;
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-leave-active {
    position: absolute;
  }
}
</style>

<i18n>
{
  "us": {
    "updateMemo": "Update Memo"
  },
  "jp": {
    "updateMemo": "メモを更新する"
  }
}
</i18n>
