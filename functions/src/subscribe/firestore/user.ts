import { EventContext } from 'firebase-functions';
import { firestore } from 'firebase-admin';

import { consumerKey, consumerSecret } from '../../secrets/twitter';

import updateNote from '../../firestore/updateNote';

const rp = require('request-promise');
const functions = require('firebase-functions');

const userInfoEndPoint = 'https://api.twitter.com/1.1/users/show.json';

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '256MB',
};

export const onCreate = functions
  .runWith(runtimeOpts)
  .firestore.document('users/{userId}')
  .onCreate((snap: firestore.DocumentSnapshot, context: EventContext) => {
    const user = snap.data();

    if (typeof user === 'undefined') {
      return;
    }

    return Promise.all([
      isPublic(user.twitterId).then((ans) => {
        return snap.ref.set({ isPublic: ans }, { merge: true });
      }),
      updateNote(snap),
    ]);
  });

export function isPublic(twitterId: string): Promise<boolean> {
  return get(userInfoEndPoint, {
    user_id: twitterId,
  })
    .then((data: any) => {
      return !data.protected;
    })
    .catch(() => {
      return true;
    });
}

function get(url: string, qs: any) {
  return rp({
    method: 'GET',
    uri: url,
    timeout: 30 * 1000,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    },
    json: true,
    qs,
  }).catch((error: any) => {
    console.error(error);
    throw error;
  });
}
