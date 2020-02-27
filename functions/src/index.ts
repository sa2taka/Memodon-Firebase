import * as admin from 'firebase-admin';
admin.initializeApp();

// The presence of an if statement prevents unnecessary modules from being loaded (see https://tech.ginco.io/post/ginco-engineer-meetup-2018-cloud-functions/#cloud-functions%E3%81%AEcold-start%E3%81%AE%E6%94%B9%E5%96%84)
if (
  !process.env.FUNCTION_NAME ||
  process.env.FUNCTION_NAME === 'onCreateUser'
) {
  exports.onCreateUser = require('./subscribe/firestore/user').onCreate;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fetchMemo') {
  exports.fetchMemo = require('./subscribe/https/fetchMemo').fetchMemo;
}

if (
  !process.env.FUNCTION_NAME ||
  process.env.FUNCTION_NAME === 'getMastodonClientInfo'
) {
  exports.getMastodonClientInfo = require('./subscribe/https/getMastodonClientInfo').getMastodonClientInfo;
}

if (
  !process.env.FUNCTION_NAME ||
  process.env.FUNCTION_NAME === 'getMastodonToken'
) {
  exports.getMastodonToken = require('./subscribe/https/getMastodonToken').getMastodonToken;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fetchOgp') {
  exports.fetchOgp = require('./subscribe/https/fetchOgp').fetchOgp;
}
