require('firebase-functions-test')();

import fetchTwittermemo from '../../src/fetchMemos/fetchTwitterMemo';
import { id, token, secret } from '../../src/secrets/twitter';

const assert = require('chai').assert;

describe('fetchTwitterMemo(test time is too long)', function() {
  this.timeout(60000);
  it('should fetch Memo', () => {
    return fetchTwittermemo(id, token, secret).then((note) => {
      assert.isArray(note);
    });
  });
});
