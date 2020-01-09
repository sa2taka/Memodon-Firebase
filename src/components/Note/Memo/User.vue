<template>
  <div class="memo-user">
    <img class="icon ml-4 mr-2" v-lazy="user.iconUrl" v-if="user" />
    <div class="name" v-if="user">
      <span class="display-name">{{ user.displayName }}</span>
      <span class="username"
        >{{ user.provider || 'twitter.com' }}@{{ user.userName }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TwitterMemo as ITwitterMemo } from '@/types/memo';
import firebase from '@/firebase';

@Component({})
export default class User extends Vue {
  @Prop({ required: true })
  public userRef!: firebase.firestore.DocumentReference | any;

  private user: any = null;

  public created() {
    this.userRef.onSnapshot((snap: any) => {
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
}
</style>
