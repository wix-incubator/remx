import _ from 'lodash';
import { touchGlobalKey, triggerStateUpdate } from './connect';
import { log, actions } from './logger';

export function state(obj) {
  return obj;
}

export function setters(obj) {
  const result = {};
  _.forEach(obj, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = (...args) => {
        v(...args);
        log({ action: actions.SETTER, name: k, args });
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
      log({ action: actions.GETTER, name: k, args });
      return v(...args);
    };
  });
  return result;
}

export { registerLogger } from './logger';

export function merge(state, delta) {
  _.forEach(delta, (v, k) => {
    state[k] = mergeOldStateWithDelta(state[k], v);
  });
}

function mergeOldStateWithDelta(oldValue, newValue) {
  if (!newValue || !_.isObjectLike(newValue)) {
    return newValue;
  }
  return _.mergeWith({}, oldValue, newValue, mergeCustomizer);
}

function mergeCustomizer(objValue, srcValue, key, object) {
  if (srcValue === undefined) {
    object[key] = undefined;
  }
  return undefined;
}
