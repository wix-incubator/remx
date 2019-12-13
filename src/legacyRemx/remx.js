import isFunction from 'lodash.isfunction';
import isObjectLike from 'lodash.isobjectlike';
import mergeWith from '../utils/mergeWith';
import { toJS as mobxToJS, configure } from 'mobx';
import { touchGlobalKey, triggerStateUpdate } from './connect';
import { logGetter, logSetter } from './logger';

configure({ isolateGlobalState: true });

export function state(obj) {
  return obj;
}

export function setters(obj) {
  const result = {};
  Object.keys(obj).forEach((k) => {
    if (isFunction(obj[k])) {
      result[k] = (...args) => {
        obj[k](...args);
        logSetter(k, args);
        triggerStateUpdate();
      };
    }
  });
  return result;
}

export function getters(obj) {
  const result = {};
  Object.keys(obj).forEach((k) => {
    result[k] = (...args) => {
      touchGlobalKey();
      logGetter(k, args);
      return obj[k](...args);
    };
  });
  return result;
}

export { registerLoggerForDebug } from './logger';

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

export function toJS(data) {
  console.warn(`remx.toJS() is deprecated. Please remove it from your code ASAP.
    Be aware that things can break after removing it, most of the time because of problematic data flow.
    Please take your time to investigate the root of cause in case of a problem, toJS() is an expansive action`);
  return mobxToJS(data);
}
