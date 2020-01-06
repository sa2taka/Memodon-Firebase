import Masto, { AccountCredentials } from 'masto';
import { firestore } from 'firebase-admin';

import masto from '../mastodon/masto';
import { createMastodonApp } from '../mastodon/mastodonAppCreator';
import fetchMastodonMemo from '../fetchMemos/fetchMastodonMemo';
import addTag from '../firestore/addTag';
import addMemo from '../firestore/addMemo';

export function getClientInfo(originUri: string) {
  const uriWithURLObject = new URL(originUri);
  const uri = uriWithURLObject.origin;
  let instance!: Masto;

  return masto({ uri })
    .then((i: Masto) => {
      instance = i;
      return firestore()
        .collection('secrets')
        .doc('mastodon')
        .collection('instances')
        .doc(uriWithURLObject.hostname)
        .get();
    })
    .then((snap) => {
      if (snap.exists) {
        const instanceData = snap.data();
        if (instanceData) {
          return Promise.resolve({
            client_id: instanceData.client_id,
            client_secret: instanceData.client_secret,
          });
        } else {
          return createMastodonApp(instance, uriWithURLObject.hostname);
        }
      } else {
        return createMastodonApp(instance, uriWithURLObject.hostname);
      }
    })
    .then((client: { client_id: string; client_secret: string }) => {
      const { client_id } = client;
      return { uri, clientId: client_id };
    })
    .catch(() => {
      return Promise.reject('Instance not found');
    });
}

export function getMastodonToken(
  code: string,
  uri: string,
  redirect_uri: string,
  uid: string
) {
  let instance!: Masto;
  const hostname = new URL(uri).hostname;
  let accessToken = '';

  return masto({ uri })
    .then((i: Masto) => {
      instance = i;
      return firestore()
        .collection('secrets')
        .doc('mastodon')
        .collection('instances')
        .doc(hostname)
        .get();
    })
    .then((snap) => {
      if (!snap.exists) {
        throw Error;
      }

      const instanceData = snap.data();
      if (!instanceData) {
        throw Error;
      }

      return instance.fetchAccessToken({
        client_id: instanceData.client_id,
        client_secret: instanceData.client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri,
      });
    })
    .then((res) => {
      accessToken = res.access_token;

      return masto({ uri, accessToken });
    })
    .then((i) => {
      instance = i;
      return instance.verifyCredentials();
    })
    .then((res) => {
      return Promise.all([
        saveAccessToken(uid, hostname, accessToken, res.id),
        saveMastodonUser(uid, hostname, res),
        saveMastodonMemo(uid, res.id, uri, accessToken),
      ]);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Something error occured');
    });
}

function saveAccessToken(
  uid: string,
  hostname: string,
  token: string,
  id: string
) {
  const data: any = {};
  data[id] = {
    accessToken: token,
  };
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('secrets')
    .doc(hostname)
    .set(data);
}

function saveMastodonUser(
  uid: string,
  hostname: string,
  credential: AccountCredentials
) {
  const data: any = {};
  data[credential.id] = {
    username: credential.username,
    display: credential.display_name,
    iconUrl: credential.avatar,
  };
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('subusers')
    .doc(hostname)
    .set(data);
}

function saveMastodonMemo(
  uid: string,
  id: string,
  uri: string,
  accessToken: string
) {
  return fetchMastodonMemo(uri, id, accessToken).then((memos) => {
    return Promise.all([addMemo(memos, uid), addTag(memos, uid)]);
  });
}
