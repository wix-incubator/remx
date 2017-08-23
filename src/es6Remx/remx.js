import * as mobx from 'mobx';
import { isFunction, forEach, isObjectLike, mergeWith } from 'lodash';
import { proxify } from './Proxify';

mobx.useStrict(true);
export function state(obj) {
  addMergeFunction(obj);
  return proxify(obj);
}

export function setters(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (isFunction(obj[key])) {
      result[key] = mobx.action(obj[key]);
    }
  });
  return result;
}

export function getters(obj) {
  const result = { __computed: {} };
  forEach(obj, (v, k) => {
    result.__computed[k] = mobx.computed(v);

    result[k] = (...args) => {
      if (args.length > 0) {
        return result.__computed[k].derivation(...args);
      } else {
        return result.__computed[k].get();
      }
    };
  });
  return result;
}

export const toJS = (obj) => {
  console.warn('toJS is deprecated. Everything is a plain object now, no need to convert');
  return obj;
};

export const map = () => {
  console.warn('map is deprecated. Just use plain object');
  return {
    set(key, value) {
      this[key] = value;
    },
    get(key) {
      return this[key];
    }
  };
};

function addMergeFunction(obj) {
  console.warn('merge is deprecated. You can just manipulate the plain object and (add keys, set keys etc..)');
  obj.merge = (delta) => {
    forEach(delta, (v, k) => {
      obj[k] = mergeOldStateWithDelta(obj[k], v);
    });
  };
}

function mergeOldStateWithDelta(oldValue, newValue) {
  if (!newValue || !isObjectLike(newValue)) {
    return newValue;
  }
  return mergeWith({}, oldValue, newValue, mergeCustomizer);
}

function mergeCustomizer(objValue, srcValue, key, object, source, stack) {
  if (srcValue === undefined) {
    object[key] = undefined;
  }
  return undefined;
}
