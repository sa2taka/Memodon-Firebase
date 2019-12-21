import Masto from 'masto';
import { firestore } from 'firebase-admin';
import { authorizeConfig } from './config';

import masto from '../mastodon/masto';
import { createMastodonApp } from '../mastodon/mastodonAppCreator';

export function getAuthenticateUrl(originUri: string) {
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
          // 整合性を取るためにsnake case
          return Promise.resolve({
            client_id: instanceData.clientId,
            client_secret: instanceData.clientSecret,
          });
        } else {
          return createMastodonApp(instance);
        }
      } else {
        return createMastodonApp(instance);
      }
    })
    .then((client: { client_id: string; client_secret: string }) => {
      const { client_id, client_secret } = client;
      return authorize(instance, client_id, client_secret);
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject('Instance not found');
    });
}

function authorize(masto: Masto, clientId: string, clientSecret: string) {
  return masto.get<any>(
    '/oauth/authorize',
    authorizeConfig(clientId, clientSecret),
    {
      maxRedirects: 0,
    }
  );
}
