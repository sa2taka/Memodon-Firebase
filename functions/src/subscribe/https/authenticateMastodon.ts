import { getClientInfo } from '../../mastodon/authWithMastodon';
import { CallableContext } from 'firebase-functions/lib/providers/https';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 12,
  memory: '256MB',
};

export const authenticateMastodon = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return getClientInfo(data.uri);
    } else {
      throw new Error('unauthenticate');
    }
  });
