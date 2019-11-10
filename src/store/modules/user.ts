import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators';
import store from '@/store/index';
import firebase from '@/firebase';

export interface UserState {
  twitterId: string;
  userName: string;
  displayName: string;
  iconUrl: string;
  isSignin: boolean;
}

@Module({ dynamic: true, store, name: 'user', namespaced: true })
class User extends VuexModule implements UserState {
  public twitterId: string = '';
  public userName: string = '';
  public displayName: string = '';
  public iconUrl: string = '';
  public isSignin: boolean = false;

  @Mutation
  public setInfo(data: UserState | undefined) {
    if (typeof data === 'undefined') {
      this._signOut();
      return;
    }
    this.twitterId = data.twitterId;
    this.userName = data.userName;
    this.displayName = data.displayName;
    this.iconUrl = data.iconUrl;
    this.isSignin = true;
  }

  @Mutation
  private _signOut() {
    this.twitterId = '';
    this.userName = '';
    this.displayName = '';
    this.iconUrl = '';
    this.isSignin = false;
  }

  @Action
  public signIn() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      return Promise.resolve(undefined);
    }
    return this.getUserFromCloud(currentUser.uid).then((user) => {
      this.setInfo(user);
    });
  }

  @Action
  private getUserFromCloud(uid: string) {
    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (doc.exists && typeof data !== 'undefined') {
          return {
            twitterId: data.twitterId,
            userName: data.userName,
            displayName: data.displayName,
            iconUrl: data.iconUrl,
            isSignin: false,
          };
        } else {
          return {
            twitterId: '',
            userName: '',
            displayName: '',
            iconUrl: '',
            isSignin: false,
          };
        }
      });
  }

  @Action({ commit: '_signOut' })
  public signOut() {
    return firebase.auth().signOut();
  }
}

const userModule = getModule(User);
export default userModule;
