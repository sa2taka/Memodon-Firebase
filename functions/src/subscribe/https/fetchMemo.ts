import { CallableContext } from 'firebase-functions/lib/providers/https';
import { updateNoteFromId } from '../../firestore/updateNote';
const functions = require('firebase-functions');

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '256MB',
};

export const fetchMemo = functions
  .runWith(runtimeOpts)
  .https.onCall((data: any, context: CallableContext) => {
    if (context.auth) {
      return updateNoteFromId(context.auth.uid);
    } else {
      throw new Error('unauthenticate');
    }
  });
