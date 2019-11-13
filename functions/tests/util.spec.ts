require('firebase-functions-test')();

import * as Util from '../src/util';
const assert = require('chai').assert;

describe('Utils', () => {
  it('should decode jwt', () => {
    // From https://jwt.io/
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expected = {
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    };
    const payload = Util.decodeJwt(jwt);
    assert.deepEqual(payload, expected);
  });
});
