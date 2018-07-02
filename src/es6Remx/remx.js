import * as mobx from 'mobx';
import { isFunction, forEach, isObjectLike, mergeWith, cloneDeep } from 'lodash';
import { proxify } from './Proxify';
import { logGetter, logSetter } from './logger';

const _ = require('lodash');

mobx.useStrict(isDev());

export { registerLoggerForDebug } from './logger';

export function state(obj) {
  return proxify(obj);
}

export function setters(obj) {
  const result = {};
  _.keys(obj).forEach((key) => {
    if (isFunction(obj[key])) {
      result[key] = mobx.action((...args) => {
        logSetter(key, args);
        obj[key](...args);
      });
    }
  });
  return result;
}

export function getters(obj) {
  const result = {};
  Object.defineProperty(result, '__computed', { value: {} });
  forEach(obj, (v, k) => {
    result.__computed[k] = mobx.computed(v);

    result[k] = (...args) => {
      logGetter(k, args);
      if (args.length > 0) {
        return result.__computed[k].derivation(...args);
      }
      return result.__computed[k].get();
    };
  });
  return result;
}

export function merge(state, delta) {
  forEach(delta, (v, k) => {
    state[k] = mergeOldStateWithDelta(state[k], v);
  });
}

function mergeOldStateWithDelta(oldValue, newValue) {
  if (!newValue || !isObjectLike(newValue)) {
    return newValue;
  }
  return mergeWith({}, oldValue, newValue, mergeCustomizer);
}

function mergeCustomizer(objValue, srcValue, key, object) {
  if (srcValue === undefined) {
    object[key] = undefined;
  }
  return undefined;
}

function isDev() {
  return global.__DEV__ ||
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'development';
}

export function toJS(data) {
  console.warn(`remx.toJS() is deprecated. Please remove it from your code ASAP. 
    Be aware that things can break after removing it, most of the time because of problematic data flow. 
    Please take your time to investigate the root of cause in case of a problem, toJS() is an expansive action`);
  return cloneDeep(data);
}
