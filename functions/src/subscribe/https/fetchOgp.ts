import { CallableContext } from 'firebase-functions/lib/providers/https';
import fo from '../../ogp/fetchOgp';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '256MB',
};

export const fetchOgp = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return fo(data.url);
    } else {
      throw new Error('unauthenticate');
    }
  });
