<template>
  <div class="memo-user" v-if="user">
    <img class="icon ml-1 mr-2" v-lazy="user.iconUrl" />
    <div class="display-name">{{ user.displayName }}</div>
    <div class="username">
      {{ user.userName }}@{{ user.provider || 'twitter.com' }}
    </div>
  </div>
  <v-skeleton-loader
    ref="skeleton"
    type="list-item-avatar-two-line"
    class="mx-auto"
    v-else
  ></v-skeleton-loader>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TwitterMemo as ITwitterMemo } from '@/types/memo';
import firebase from '@/firebase';

@Component({})
export default class User extends Vue {
  @Prop({ required: true })
  public userRef!: firebase.firestore.DocumentReference;

  private user: any = null;

  public created() {
    this.userRef.onSnapshot((snap) => {
      this.user = snap.data();
    });
  }
}
</script>

<style lang="scss" scoped>
.memo-user {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'g0 g1' 'g0 g3';
  grid-gap: 2px 12px;
}

.icon {
  grid-area: g0;
  width: 48px;
  height: 48px;
  border-radius: 24px 24px;
}

.display-name {
  grid-area: g1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.username {
  grid-area: g3;
  font-size: 0.8em;
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.user-skelton {
  height: 48px;
  width: 100%;
}
</style>
