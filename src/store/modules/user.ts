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
  uid: string;
  twitterId: string;
  userName: string;
  displayName: string;
  iconUrl: string;
  isSignin: boolean;
}

@Module({ dynamic: true, store, name: 'user', namespaced: true })
class User extends VuexModule implements UserState {
  public uid: string = '';
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
    this.uid = data.uid;
    this.twitterId = data.twitterId;
    this.userName = data.userName;
    this.displayName = data.displayName;
    this.iconUrl = data.iconUrl;
    this.isSignin = true;
  }

  @Mutation
  private _signOut() {
    this.uid = '';
    this.twitterId = '';
    this.userName = '';
    this.displayName = '';
    this.iconUrl = '';
    this.isSignin = false;
  }

  @Action
  public signIn() {
    let currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      return firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          return this._signOut();
        }

        return this.getUserFromCloud(user.uid).then((user) => {
          if (user.isSignin) {
            this.setInfo(user);
          } else {
            this.signOut();
          }
        });
      });
    }
    return this.getUserFromCloud(currentUser.uid).then((user) => {
      if (user.isSignin) {
        this.setInfo(user);
      } else {
        this.signOut();
      }
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
            uid: uid,
            twitterId: data.twitterId,
            userName: data.userName,
            displayName: data.displayName,
            iconUrl: data.iconUrl,
            isSignin: true,
          };
        } else {
          return {
            uid: '',
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
