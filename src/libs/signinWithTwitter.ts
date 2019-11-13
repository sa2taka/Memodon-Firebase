import firebase from '@/firebase';
import router from '@/router/index';
import User from '@/store/modules/user';

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
  const dbRef = createUserIntoCloud(result);
  if (typeof dbRef === 'undefined') {
    throw 'update error';
  }
  return dbRef
    .then(() => {
      User.signIn();
    })
    .then(() => {
      router.push('/');
    });
};

const handleError = (reason: any) => {
  return reason;
};

const createUserIntoCloud = (user: firebase.auth.UserCredential) => {
  if (
    user.user &&
    user.additionalUserInfo &&
    user.credential &&
    user.user.providerData[0]
  ) {
    const userData = {
      // @ts-ignore `because user.user.providerData[0].uid` is not null, but Lint tell "Object is possibly 'null'".
      twitterId: user.user.providerData[0].uid,
      userName: user.additionalUserInfo.username,
      displayName: user.user.displayName,
      iconUrl: user.user.photoURL,
    };

    const secretData = {
      token: (user.credential as firebase.auth.OAuthCredential).accessToken,
      secret: (user.credential as firebase.auth.OAuthCredential).secret,
    };

    return Promise.all([
      firebase
        .firestore()
        .collection('users')
        .doc(user.user.uid)
        .set(userData, { merge: true }),
      firebase
        .firestore()
        .collection('secrets')
        .doc(userData.twitterId)
        .set(secretData, { merge: true }),
    ]);
  }
};
