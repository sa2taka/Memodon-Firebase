const test = require('firebase-functions-test')();
const sinon = require('sinon');
const admin = require('firebase-admin');
sinon.stub(admin, 'initializeApp');

import { createMastodonUser } from '../../../src/subscribe/https/createMastodonUser';
const wrapped = test.wrap(createMastodonUser);

require('../../config');

const assert = require('chai').assert;

describe('authorize flow', function() {
  it('should create redirect url', () => {
    const correctUri = 'https://mstdn-workers.com';
    wrapped({ uri: correctUri }, { auth: 'example' }).then((data: any) => {
      console.log(data);
    });
  });

  it('should not create mastodon instance', async () => {
    const incorrectUri = 'https://example.com';
    try {
      await wrapped({ uri: incorrectUri }, { auth: 'example' });
      fail();
    } catch (e) {
      assert.equal(e, 'Instance not found');
    }
  });
});
