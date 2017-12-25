import * as mobx from 'mobx';

const { keys, isObjectLike, isString } = require('lodash');
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
      if (isString(prop)) {
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
  return new Proxy(obj, handler);
}

const createObservableMap = (obj) => {
  const tracker = mobx.observable.shallowMap();
  keys(obj).forEach((key) => {
    if (isObjectLike(obj[key]) && !alreadyProxiedObjects.has(obj[key])) {
      obj[key] = proxify(obj[key]);
    }
    tracker.set(key, obj[key]);
  });
  return tracker;
};

module.exports = {
  proxify
};
