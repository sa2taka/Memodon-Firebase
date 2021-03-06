require('firebase-functions-test')();
const rewire = require('rewire');

const assert = require('chai').assert;
const User = rewire('../../../src/subscribe/firestore/user');
import { id } from '../../../src/secrets/twitter';

describe('Utils', () => {
  it('should get private', () => {
    return User.isPublic(id).then((ans: boolean) => {
      assert.isTrue(ans);
    });
  });
});
