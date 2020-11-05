import * as mobx from 'mobx';
import isFunction from 'lodash.isfunction';
import isObjectLike from 'lodash.isobjectlike';
import mergeWith from '../utils/mergeWith';
import { proxify } from './Proxify';
import { logGetter, logSetter } from './logger';

mobx.configure({ enforceActions: isDev() ? 'observed' : 'never', isolateGlobalState: true });

export { registerLoggerForDebug } from './logger';

export function state(obj) {
  return proxify(obj);
}

export function setters(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
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
  Object.keys(obj).forEach((k) => {
    result.__computed[k] = mobx.computed(obj[k]);

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
  Object.keys(delta).forEach((k) => {
    state[k] = mergeOldStateWithDelta(state[k], delta[k]);
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
  return mobx.toJS(data);
}
