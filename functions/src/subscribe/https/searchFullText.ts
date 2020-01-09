import { CallableContext } from 'firebase-functions/lib/providers/https';
import sft from '../../firestore/fullTextSearch';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 10,
  memory: '256MB',
};

export const searchFullText = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return sft(context.auth.uid, data.queries, data.limit, data.until);
    } else {
      throw new Error('unauthenticate');
    }
  });
