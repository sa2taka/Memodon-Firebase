import Masto from 'masto';
import { firestore } from 'firebase-admin';

import masto from '../mastodon/masto';
import { createMastodonApp } from '../mastodon/mastodonAppCreator';

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
