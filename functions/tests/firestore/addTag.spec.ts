require('firebase-functions-test')();

import { id, token, secret } from '../../src/secrets/twitter';
const rewire = require('rewire');
const extractTags = rewire('../../src/firestore/addTag').extractTags;
import fetchTwittermemo from '../../src/fetchMemos/fetchTwitterMemo';

// const assert = require('chai').assert;

describe.skip('fetchTwitterMemo(test time is too long)', function() {
  this.timeout(60000);
  it('should extract tags', () => {
    return fetchTwittermemo(id, token, secret).then((forUser) => {
      const tags = extractTags(forUser);
      console.log(tags);
    });
  });
});
