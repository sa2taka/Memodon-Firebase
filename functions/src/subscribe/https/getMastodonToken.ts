import { getMastodonToken as gmt } from '../../mastodon/authWithMastodon';
import { CallableContext } from 'firebase-functions/lib/providers/https';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 6,
  memory: '256MB',
};

export const getMastodonToken = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return gmt(data.code, data.uri, data.redirectUri, context.auth.uid);
    } else {
      throw new Error('unauthenticate');
    }
  });
