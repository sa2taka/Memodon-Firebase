import Masto, { OAuthClient } from 'masto';
import { appConfig } from './config';
import { firestore } from 'firebase-admin';

export function createMastodonApp(masto: Masto, hostname: string) {
  let client_id = '';
  let client_secret = '';
  console.log(appConfig);

  return masto
    .createApp(appConfig)
    .then((client: OAuthClient) => {
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
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}
