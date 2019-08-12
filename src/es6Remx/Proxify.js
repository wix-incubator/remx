import * as mobx from 'mobx';

import isObjectLike from 'lodash.isobjectlike';

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
