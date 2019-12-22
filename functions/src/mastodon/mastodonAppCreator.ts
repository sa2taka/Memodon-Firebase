import Masto from 'masto';
import { appConfig } from './config';
import { firestore } from 'firebase-admin';

export function createMastodonApp(masto: Masto, hostname: string) {
  let client_id = '';
  let client_secret = '';
  return masto
    .createApp(appConfig)
    .then((client: { client_id: string; client_secret: string }) => {
      client_id = client.client_id;
      client_secret = client.client_secret;

      return firestore()
        .collection('secrets')
        .doc('mastodon')
        .collection('instances')
        .doc(hostname)
        .set({
          client_id,
          client_secret,
        });
    })
    .then(() => {
      return {
        client_id,
        client_secret,
      };
    });
}
