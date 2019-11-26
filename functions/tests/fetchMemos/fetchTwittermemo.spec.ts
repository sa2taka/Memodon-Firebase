require('../config');

import fetchTwittermemo from '../../src/fetchMemos/fetchTwitterMemo';
import { id, token, secret } from '../../src/secrets/twitter';

const assert = require('chai').assert;

describe.skip('fetchTwitterMemo(test time is too long)', function() {
  this.timeout(60000);
  it('should fetch Memo', () => {
    return fetchTwittermemo(id, token, secret).then((forUser) => {
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
        ]);
        for (const key of Object.keys(memo)) {
          // @ts-ignore
          assert.isNotNull(memo[key]);
        }
      });
    });
  });
});
