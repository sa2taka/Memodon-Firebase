import firebase from '@/firebase';

const windowName = 'authWithMastodon';
const windowWidth = 660;
const windowHeight = 480;
const windowLeft = (screen.availWidth - windowWidth) / 2;
const windowTop = (screen.availHeight - windowHeight) / 2;
// Display center
const windowSize = `width=${windowWidth},height=${windowHeight},top=${windowTop},left=${windowLeft}`;

export function startAuthWithMastodonWindow() {
  window.open('/auth/mastodon', windowName, windowSize);
}

export function getAccessToken(code: string) {
  const uri = sessionStorage.getItem('authMastodonUrl');
  sessionStorage.setItem('authMastodonUrl', '');
  const redirectUri = createRedirectUri();

  const getMastodonToken = firebase
    .functions()
    .httpsCallable('getMastodonToken');

  return getMastodonToken({ code, uri, redirectUri });
}

function createRedirectUri() {
  const redirectPath = '/auth/mastodon/code';
  const redirectOrigin = new URL(document.URL).origin;

  return redirectOrigin + redirectPath;
}
