import * as mobx from 'mobx';

import isObjectLike from 'lodash.isobjectlike';
import immutableDate from '../utils/immutableDate';
import { isReactUpdating } from '../utils/isReactUpdating';
import { isRenderingObserver, isAccessStateStrictMode } from './globalState';
import { isDev } from '../utils/isDev';

const alreadyProxiedObjects = new WeakMap();

function proxify(obj) {
  alreadyProxiedObjects.set(obj, true);
  const tracker = createObservableMap(obj);
  const handler = {
    ownKeys: (target) => {
      tracker.keys();
      return Reflect.ownKeys(target);
    },
    get: (target, prop) => {
      if (typeof prop === 'string') {
        if (isDev() && isReactUpdating() && !isRenderingObserver() && isAccessStateStrictMode()) {
          console.error(
            `[REMX] attempted to access prop '${prop}' in react component untracked by remx`
          );
        }
        tracker.get(prop);
        return target[prop];
      }
      return undefined;
    },
    set: (target, prop, value) => {
      let newValue = value;
      if (isObjectLike(value) && !alreadyProxiedObjects.has(value)) {
        newValue = proxify(value);
      }
      target[prop] = newValue;
      tracker.set(prop, newValue);
      return true;
    }
  };
  const proxiedObject = new Proxy(obj, handler);
  alreadyProxiedObjects.set(proxiedObject, true);
  return proxiedObject;
}

const createObservableMap = (obj) => {
  const tracker = mobx.observable.map({}, { deep: false });
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isObjectLike(value) && !alreadyProxiedObjects.has(value) && value instanceof Date === false) {
      obj[key] = proxify(value);
    }
    if (value instanceof Date) {
      obj[key] = immutableDate(value);
    }
const createObservableMap = (obj) => {
  const tracker = mobx.observable.map({}, { deep: false });
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isObjectLike(value) && !alreadyProxiedObjects.has(value) && value instanceof Date === false) {
      obj[key] = proxify(value);
    }
    if (value instanceof Date) {
      obj[key] = immutableDate(value);
    }
    if (Array.isArray(value)) {
      obj[key] = Array.from(value);
    }
    tracker.set(key, value);
  });
  return tracker;
};
    tracker.set(key, value);
  });
  return tracker;
};

module.exports = {
  proxify
};
