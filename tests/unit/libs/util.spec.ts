import * as Util from '@/libs/util';

describe('Util', () => {
  beforeEach(() => {});

  test('uniq', () => {
    const ary = ['1', '3', '2', '4', '1', '4', '2', '2', '1', '3', '5', '2'];
    const expected = ['1', '2', '3', '4', '5'];
    const actual = Util.uniq(ary).sort();
    expect(actual).toStrictEqual(expected);
  });
});
