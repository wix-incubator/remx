import * as mobx from 'mobx';
import _ from 'lodash';

mobx.useStrict(true);

export function state(obj) {
  return mobx.observable(obj);
}

export function setters(obj) {
  const result = {};
  _.forEach(obj, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = mobx.action(v);
    }
  });
  return result;
}

export function getters(obj) {
  const result = {__computed: {}};
  _.forEach(obj, (v, k) => {
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

export const toJS = mobx.toJS;
