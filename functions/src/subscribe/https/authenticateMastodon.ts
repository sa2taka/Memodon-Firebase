import { getAuthenticateUrl } from '../../mastodon/authWithMastodon';
import { CallableContext } from 'firebase-functions/lib/providers/https';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '256MB',
};

export const authenticateMastodon = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return getAuthenticateUrl(data.uri);
    } else {
      throw new Error('unauthenticate');
    }
  });
