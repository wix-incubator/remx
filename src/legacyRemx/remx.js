import * as mobx from 'mobx';
import _ from 'lodash';
import { touchGlobalKey, triggerStateUpdate } from './connect';

export function state(obj) {
  addMergeFunction(obj);
  return obj;
}

export function setters(obj) {
  const result = {};
  _.forEach(obj, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = (...args) => {
        v(...args);
        triggerStateUpdate();
      };
    }
  });
  return result;
}

export function getters(obj) {
  const result = {};
  _.forEach(obj, (v, k) => {
    result[k] = (...args) => {
      touchGlobalKey();
      return v(...args);
    };
  });
  return result;
}

export const toJS = (obj) => {
  // console.warn('toJS is deprecated. Everything is a plain object now, no need to convert');
  return obj;
};

export const map = () => {
  // console.warn('map is deprecated. Just use plain object');
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
  // console.warn('merge is deprecated. You can just manipulate the plain object and (add keys, set keys etc..)');
  obj.merge = (delta) => {
    _.forEach(delta, (v, k) => {
      obj[k] = mergeOldStateWithDelta(obj[k], v);
    });
  };
}

function mergeOldStateWithDelta(oldValue, newValue) {
  if (!newValue || !_.isObjectLike(newValue)) {
    return newValue;
  }
  return _.mergeWith({}, oldValue, newValue, mergeCustomizer);
}

function mergeCustomizer(objValue, srcValue, key, object, source, stack) {
  if (srcValue === undefined) {
    object[key] = undefined;
  }
  return undefined;
}
