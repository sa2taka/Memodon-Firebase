require('../config');

import fetchMastodonMemo from '../../src/fetchMemos/fetchMastodonMemo';
import { id, token, uri } from '../../src/secrets/mastodon';

const assert = require('chai').assert;

describe('fetchMastodonMemo', function() {
  this.timeout(60000);
  it('should fetch Memo', () => {
    return fetchMastodonMemo(uri, id, token).then((forUser) => {
      assert.isNotNull(forUser);

      forUser.forEach((memo) => {
        assert.hasAllKeys(memo, [
          'id',
          'timestamp',
          'text',
          'entities',
          'provider',
          'providerId',
          'createdAt',
          'updatedAt',
          'visibility',
        ]);
        for (const key of Object.keys(memo)) {
          // @ts-ignore
          assert.isNotNull(memo[key]);
        }
      });
    });
  });
});
