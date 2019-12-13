/* original: https://github.com/lodash/lodash/blob/912d6b04/test/test.js#L15183 */
import mergeWith from './mergeWith';

const identity = (value) => value;
const noop = () => {};

describe('mergeWith', () => {
  it('should ignore bad sources', () => {
    const actual = mergeWith({ a: 1 }, undefined, null, 's', { b: 1 }, noop);
    expect(actual).toEqual({ a: 1, b: 1 });
  });

  it('should handle merging when `customizer` returns `undefined`', () => {
    let actual = mergeWith({ a: { b: [1, 1] } }, { a: { b: [0] } }, noop);
    expect(actual).toEqual({ a: { b: [0, 1] } });

    actual = mergeWith([], [undefined], identity);
    expect(actual).toEqual([undefined]);
  });

  it('should clone sources when `customizer` returns `undefined`', () => {
    const source1 = { a: { b: { c: 1 } } },
      source2 = { a: { b: { d: 2 } } };

    mergeWith({}, source1, source2, noop);
    expect(source1.a.b).toEqual({ c: 1, d: 2 });
  });

  it('should defer to `customizer` for non `undefined` results', () => {
    const actual = mergeWith({ a: { b: [0, 1] } }, { a: { b: [2] } }, (a, b) => {
      return Array.isArray(a) ? a.concat(b) : undefined;
    });

    expect(actual).toEqual({ a: { b: [0, 1, 2] } });
  });

  it('should overwrite primitives with source object clones', () => {
    const actual = mergeWith({ a: 0 }, { a: { b: ['c'] } }, () => undefined);
    expect(actual).toEqual({ a: { b: ['c'] } });
  });

  it('should pop the stack of sources for each sibling property', () => {
    const array = ['b', 'c'],
      object = { a: ['a'] },
      source = { a: array, b: array };

    const actual = mergeWith(object, source, (a, b) => {
      return Array.isArray(a) ? a.concat(b) : undefined;
    });

    expect(actual).toEqual({ a: ['a', 'b', 'c'], b: ['b', 'c'] });
  });
});
