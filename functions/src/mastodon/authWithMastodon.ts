import Masto from 'masto';
import { firestore } from 'firebase-admin';

import masto from '../mastodon/masto';
import { createMastodonApp } from '../mastodon/mastodonAppCreator';

import {
  saveAccessToken,
  saveMastodonUser,
  saveMastodonMemo,
} from '../firestore/saveMastodonInfo';
import { generateUUID } from '../util';

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
  let subuserId = '';

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
      subuserId = generateUUID(hostname + res.id);
      return Promise.all([
        saveAccessToken(uid, hostname, accessToken, res.id),
        saveMastodonUser(uid, hostname, uri, res),
      ]);
    })
    .then((_) => {
      return Promise.all([
        firestore()
          .collection('users')
          .doc(uid)
          .get(),
        firestore()
          .collection('users')
          .doc(uid)
          .collection('subusers')
          .doc(subuserId)
          .get(),
      ]);
    })
    .then((resolved) => {
      return saveMastodonMemo(...resolved);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Something error occured');
    });
}
