import fetchOgp from '../../src/ogp/fetchOgp';

require('../config');

const assert = require('chai').assert;

describe('fetchOgp', function() {
  it('should fetch OGP', () => {
    const url = 'https://github.com/sa2taka';

    fetchOgp(url).then((ogp: any) => {
      assert.isObject(ogp);
    });
  });
});
