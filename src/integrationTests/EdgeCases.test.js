['es6Remx', 'legacyRemx'].forEach((version) => {
  describe(`EdgeCases (${version})`, () => {
    let remx, mobx;
    let state, setters, getters, anotherState;

    beforeEach(() => {
      mobx = require('mobx');
      remx = require(`../${version}/remx`);

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

    afterEach(() => {
      delete global.__mobxInstanceCount; // prevent warnings
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
      const expectedCallCounts = { es6Remx: 1, legacyRemx: 2 };
      expect(callCount).toEqual(expectedCallCounts[version]);
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
      const expectedCallCounts = { es6Remx: 1, legacyRemx: 2 };
      expect(callCount).toEqual(expectedCallCounts[version]);
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

    it('support reusing already proxified objects)', () => {
      const initial = {counter: {count: 1}}
      const state = remx.state({});
      state.a = {...initial};
      state.b = {...initial};
      const getters = remx.getters({
        getCount() {
          return state.b.counter.count;
        }
      });
      setters = remx.setters({
        modify(val) {
          state.b.counter.count = val;
        },
      });

      const runs = [];
      mobx.autorun(() => {
        runs.push(getters.getCount());
      });

      setters.modify(2);
      setters.modify(3);

      expect(runs).toEqual([1, 2, 3]);
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
      const remx = require(`../${version}/remx`);
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

      const remx = require(`../${version}/remx`);
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
    const remx = require(`../${version}/remx`);
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

        Object.keys(setters).forEach((name) => this[name] = setters[name]);
        Object.keys(getters).forEach((name) => this[name] = getters[name]);
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
});
