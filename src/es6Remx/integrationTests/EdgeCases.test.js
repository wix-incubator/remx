import * as _ from 'lodash';

describe(`EdgeCases`, () => {
  let remx, mobx;
  let state, setters, getters, anotherState;

  beforeEach(() => {
    mobx = require('mobx');
    remx = require('../remx');

    anotherState = remx.state({
      count: 0
    });

    state = remx.state({
      obj: {
        foo: 'bar'
      }
    });
    setters = remx.setters({
      modify() {
        state.anotherState = anotherState;
        anotherState.count++;
      },
      add(o) {
        state.added = { o };
      }
    });
    getters = remx.getters({
      getCount() {
        return state.anotherState ? state.anotherState.count : -1;
      }
    });
  });

  it('support setting partial remx state inside another state', () => {
    const state1 = remx.state({ obj1: { arr1: [] } });
    const state2 = remx.state({});

    const getter1 = remx.getters({ getObj1: () => state1.obj1 });
    const setter2 = remx.setters({ set: () => state2.someProp = getter1.getObj1() });

    let callCount = 0;
    const stop = mobx.autorun(() => {
      JSON.stringify(getter1.getObj1());
      callCount++;
    });
    expect(callCount).toEqual(1);
    setter2.set();
    expect(callCount).toEqual(1);
    stop();
    expect(state2.someProp).toEqual({ arr1: [] });
  });

  it('supports partial state from another state with arrays', () => {
    const key1 = { name: 'key1' };
    const key2 = { name: 'key2' };
    const state1 = remx.state({ obj1: { arr1: [key1, key2] } });
    const state2 = remx.state({});

    const getter1 = remx.getters({ getArr: () => state1.obj1.arr1 });
    const setter2 = remx.setters({ set: (k) => state2.someProp = k });

    let callCount = 0;
    const stop = mobx.autorun(() => {
      JSON.stringify(getter1.getArr());
      callCount++;
    });
    expect(callCount).toEqual(1);
    setter2.set(getter1.getArr()[0]);
    expect(callCount).toEqual(1);
    stop();
    expect(state2.someProp).toEqual({ name: 'key1' });
  });

  it('support observing on observable objects (remx state inside remx state)', () => {
    const runs = [];
    const stop = mobx.autorun(() => {
      runs.push(getters.getCount());
    });

    expect(getters.getCount()).toEqual(-1);
    setters.modify();
    expect(getters.getCount()).toEqual(1);
    setters.modify();
    expect(anotherState.count).toEqual(2);

    stop();

    expect(runs).toEqual([-1, 1, 2]);
  });

  it('support setting complex getters object inside state', () => {
    const makeEntity = () => {
      const state = remx.state({ id: 1 });
      const getters = remx.getters({
        _getId() {
          return state.id;
        },
        getId() {
          return getters._getId();
        }
      });
      return getters;
    };

    const makeStore = () => {
      const state = remx.state({ entity: makeEntity() });
      return remx.getters({
        getEntity() {
          return state.entity;
        }
      });
    };

    expect(makeStore().getEntity().getId()).toEqual(1);
  });

  it('supports cyclic objects', () => {
    const obj = { a: { b: { c: {} } } };
    obj.a.b.c = obj;

    expect(() => setters.add(obj)).not.toThrow();
  });
});

describe('prod test', () => {
  it('does not throw mutation in production', () => {
    global.__DEV__ = false;
    const remx = require('../remx');
    const mobx = require('mobx');

    const state = remx.state({ obj: {} });

    const stop = mobx.autorun(() => {
      expect(state.obj).toBeDefined();
    });
    expect(() => state.obj = 1).not.toThrow();
    stop();
  });

  it('does not throw mutation in production2', () => {
    const origProcess = process;
    process = { env: { NODE_ENV: 'prod' } };  // eslint-disable-line no-global-assign

    const remx = require('../remx');
    const mobx = require('mobx');

    const state = remx.state({ obj: {} });

    const stop = mobx.autorun(() => {
      expect(state.obj).toBeDefined();
    });
    expect(() => state.obj = 1).not.toThrow();
    stop();
    process = origProcess; // eslint-disable-line no-global-assign
  });
});

describe(`state instance`, () => {
  const remx = require('../remx');
  class Store {
    constructor() {
      this.reset();
    }

    reset() {
      const state = remx.state({
        foo: {
          bar: 123
        }
      });

      const setters = remx.setters({
        setFooBar(n) {
          state.foo.bar = n;
        },

        addSomething(k, v) {
          state[k] = v;
        }
      });

      const getters = remx.getters({
        getFooBar() {
          return state.foo.bar;
        },

        getSomething(k) {
          return state[k];
        }
      });

      _.functions(setters).forEach((name) => this[name] = setters[name]);
      _.functions(getters).forEach((name) => this[name] = getters[name]);
    }
  }

  it('reset example', () => {
    const store = new Store();
    expect(store.getFooBar()).toEqual(123);
    expect(store.getSomething('hi')).toEqual(undefined);
    store.setFooBar(456);
    store.addSomething('hi', 'ho');
    expect(store.getFooBar()).toEqual(456);
    expect(store.getSomething('hi')).toEqual('ho');

    store.reset();
    expect(store.getFooBar()).toEqual(123);
    expect(store.getSomething('hi')).toEqual(undefined);
  });
});
