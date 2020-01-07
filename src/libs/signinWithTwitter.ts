import firebase from '@/firebase';
import router from '@/router/index';
import User from '@/store/modules/user';
import { generateUUID } from './util';

const provider = new firebase.auth.TwitterAuthProvider();

export const signinWithPopup = () => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(signinWithTwitter)
    .catch(handleError);
};

export const redirectSigninPage = () => {
  return firebase.auth().signInWithRedirect(provider);
};

export const getRedirectResult = () => {
  return firebase
    .auth()
    .getRedirectResult()
    .then(signinWithTwitter)
    .catch(handleError);
};

const signinWithTwitter = (result: firebase.auth.UserCredential) => {
  if (!result.user) {
    return;
  }

  return createUserIntoCloud(result)
    .then(() => {
      User.signIn();
    })
    .then(() => {
      router.push('/note');
    });
};

const handleError = (reason: any) => {
  return reason;
};

const createUserIntoCloud = (user: firebase.auth.UserCredential) => {
  const userInfo = user.user;
  if (
    userInfo &&
    user.additionalUserInfo &&
    user.credential &&
    userInfo.providerData[0]
  ) {
    const userData: any = {
      provider: 'twitter.com',
      // @ts-ignore `because user.user.providerData[0].uid` is not null, but Lint tell "Object is possibly 'null'".
      providerId: userInfo.providerData[0].uid,
      userName: user.additionalUserInfo.username,
      displayName: userInfo.displayName,
      iconUrl: userInfo.photoURL,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (user.additionalUserInfo.isNewUser) {
      userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    const secretData = {
      token: (user.credential as firebase.auth.OAuthCredential).accessToken,
      secret: (user.credential as firebase.auth.OAuthCredential).secret,
    };

    return firebase
      .firestore()
      .collection('users')
      .doc(userInfo.uid)
      .set(userData, { merge: true })
      .then(async () => {
        return firebase
          .firestore()
          .collection('users')
          .doc(userInfo.uid)
          .collection('secrets')
          .doc(await generateUUID('twitter.com' + userData.providerId))
          .set(secretData, { merge: true });
      });
  } else {
    return Promise.resolve();
  }
};
