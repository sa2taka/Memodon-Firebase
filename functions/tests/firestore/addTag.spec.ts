require('../config');

import { id, token, secret } from '../../src/secrets/twitter';
const rewire = require('rewire');
const extractTags = rewire('../../src/firestore/addTag').__get__('extractTags');
import fetchTwittermemo from '../../src/fetchMemos/fetchTwitterMemo';
const assert = require('chai').assert;

describe('addTag(test time is too long)', function() {
  this.timeout(60000);
  it.skip('should extract tags', () => {
    return fetchTwittermemo(id, token, secret).then((forUser) => {
      const tags = extractTags(forUser);
      assert.isNotNull(tags);
      assert.isArray(tags);
    });
  });

  it('should extranc empty', () => {
    const tags = extractTags([]);
    assert.isNotNull(tags);
    assert.isArray(tags);
  });
});
