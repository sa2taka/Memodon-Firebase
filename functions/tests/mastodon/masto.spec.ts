import masto from '../../src/mastodon/masto';

require('../config');

const assert = require('chai').assert;

describe('mastodon instance creator', function() {
  it('should create mastodon instance', () => {
    const correctUri = 'https://mstdn-workers.com';
    masto({ uri: correctUri }).then((instance) => {
      assert.typeof(instance, 'Masto');
    });
  });

  it('should not create mastodon instance', async () => {
    const incorrectUri = 'https://example.com';
    try {
      await masto({ uri: incorrectUri });
      fail();
    } catch (e) {
      assert.equal(e, 'Instance not found');
    }
  });
});
