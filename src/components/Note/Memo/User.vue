<template>
  <div class="memo-user" v-if="user">
    <img class="icon ml-4 mr-2" v-lazy="user.iconUrl" />
    <div class="name">
      <span class="display-name">{{ user.displayName }}</span>
      <span class="username"
        >{{ user.userName }}@{{ user.provider || 'twitter.com' }}</span
      >
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
  display: flex;
  height: 48px;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 24px 24px;
}

.name {
  display: flex;
  flex-flow: column;
}

.username {
  font-size: 0.8em;
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-skelton {
  height: 48px;
  width: 100%;
}
</style>
