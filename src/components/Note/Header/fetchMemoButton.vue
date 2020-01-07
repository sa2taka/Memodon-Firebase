<template>
  <v-btn
    color="secondary"
    @click="callToFetchMemo"
    :disabled="disable"
    width="160"
  >
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

import User from '@/store/modules/user';

import Loading from '@/components/Atomic/Loading.vue';

@Component({
  components: {
    Loading,
  },
})
export default class fetchMemoButton extends Vue {
  public isLoading = false;
  public fifteenMinutesAfterlastFetchDay: number = 0;
  public disable = true;

  public created() {
    this.subscribeUserAndUpdateDisable();
    this.startDisableUpdateCycle();
  }

  public callToFetchMemo() {
    const fetchMemo = firebase.functions().httpsCallable('fetchMemo');
    this.isLoading = true;
    this.disable = true;

    fetchMemo()
      .then((result) => {
        this.isLoading = false;
        this.updateDisableStatus();
      })
      .catch(() => {
        this.isLoading = false;
        this.updateDisableStatus();
      });
  }

  private subscribeUserAndUpdateDisable() {
    const currentUser = firebase.auth().currentUser || User;
    const callback = (uid: string) => {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .onSnapshot((user) => {
          try {
            const data = user.data();

            if (data) {
              const lastFetchDay: Date = data.lastFetched.toDate();
              this.fifteenMinutesAfterlastFetchDay =
                lastFetchDay.getTime() + 15 * 60 * 1000;
              this.updateDisableStatus();
            }
          } catch {
            this.updateDisableStatus();
          }
        });
    };

    if (currentUser.uid === '') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          callback(user.uid);
        }
      });
    } else {
      callback(currentUser.uid);
    }
  }

  private startDisableUpdateCycle() {
    setInterval(this.updateDisableStatus, 15 * 60 * 1000);
  }

  private updateDisableStatus() {
    this.disable = Date.now() < this.fifteenMinutesAfterlastFetchDay;
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
