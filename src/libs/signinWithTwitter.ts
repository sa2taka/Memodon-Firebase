import firebase from '@/firebase';
import router from '@/router/index';

const provider = new firebase.auth.TwitterAuthProvider();

export const signinWithPopup = () => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(signInWithTwitter)
    .catch(handleError);
};

export const redirectSigninPage = () => {
  return firebase.auth().signInWithRedirect(provider);
};

export const getRedirectResult = () => {
  return firebase
    .auth()
    .getRedirectResult()
    .then(signInWithTwitter)
    .catch(handleError);
};

export const signInWithTwitter = (result: firebase.auth.UserCredential) => {
  router.push('/');
  return result;
};

export const handleError = (reason: any) => {
  return reason;
};
