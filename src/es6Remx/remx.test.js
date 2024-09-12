import * as remx from './remx';
import * as mobx from 'mobx';
import { grabConsole } from '../utils/testUtils';

const strictError = expect.stringContaining(
    '[MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify:'
);

describe('remx!', () => {
  let state, setters, getters, getNameCalled, getFullNameCalled;

  beforeEach(() => {
    getNameCalled = 0;
    getFullNameCalled = 0;
    state = remx.state({
      name: 'Gandalf',
      lastName: 'The grey',
      age: {
        is: 0
      },
      job: {
        experience: 'infinite'
      },
      dynamicallyCreatedKeys: {},
      multiPropObject: {
        prop1: '1',
        prop2: '2',
        prop3: '3'
      },
      race: 'unknown'
    });

    setters = remx.setters({
      bla: 'blabla',
      setMultiPropObject() {
        state.multiPropObject.prop1 = 'changed!';
        state.multiPropObject.prop2 = 'changed!';
        state.multiPropObject.prop3 = 'changed!';
      },
      setName(name) {
        state.name = name;
      },

      setAge(n) {
        state.age.is = n;
      },

      createKeyDynamically(n) {
        state.dynamicallyCreatedKeys.inner = n;
      },

      usingMerge(n) {
        remx.merge(state, { dynamicallyCreatedKeys: { foo: n } });
      },

      usingMergeWithValue(v) {
        remx.merge(state, { dynamicallyCreatedKeys: v });
      },

      setJobDescriptionUsingMerge(v) {
        remx.merge(state, { job: { description: v } });
      },

      setRace(v) {
        remx.merge(state, { race: v });
      }
    });

    getters = remx.getters({
      getMultiPropObject() {
        return state.multiPropObject;
      },
      getName() {
        getNameCalled++;
        return state.name;
      },

      getFullName(separator) {
        getFullNameCalled++;
        return getters.getName() + separator + state.lastName;
      },

      getDynamicallyCreatedKey() {
        return state.dynamicallyCreatedKeys.inner || 'not yet set';
      },
      getAge() {
        return state.age.is;
      }
    });
  });

  it('preserves objects shapes', () => {
    expect(Object.keys(state)).toEqual([
      'name',
      'lastName',
      'age',
      'job',
      'dynamicallyCreatedKeys',
      'multiPropObject',
      'race'
    ]);
    expect(Object.keys(getters)).toEqual([
      'getMultiPropObject',
      'getName',
      'getFullName',
      'getDynamicallyCreatedKey',
      'getAge'
    ]);
    expect(Object.keys(setters)).toEqual([
      'setMultiPropObject',
      'setName',
      'setAge',
      'createKeyDynamically',
      'usingMerge',
      'usingMergeWithValue',
      'setJobDescriptionUsingMerge',
      'setRace'
    ]);
  });

  it('wraps observable state without impacting testability', () => {
    expect(state.name).toEqual('Gandalf');
    expect(state.lastName).toEqual('The grey');
  });

  it('wraps observable state without impacting testability', () => {
    expect(state.name).toEqual('Gandalf');
    expect(state.lastName).toEqual('The grey');
  });

  it('enforces strict mode, no one is allowed to touch state outside of mobx actions', () => {
    const stopObservation = mobx.autorun(() => getters.getName());
    expect(grabConsole(() => {
      state.name = 'hi';
    })).toEqual([['warn', strictError]]);
    stopObservation();
  });

  it('enforces strict mode recursively', () => {
    const stopObservation = mobx.autorun(() => getters.getAge());
    expect(grabConsole(() => {
      state.age.is = 3;
    })).toEqual([['warn', strictError]]);
    stopObservation();
  });

  it('setters are wrapped in mobx action', () => {
    expect(state.name).toEqual('Gandalf');
    setters.setName('other');
    expect(state.name).toEqual('other');
  });

  it('setters can mutate nested objects', () => {
    expect(state.age.is).toEqual(0);
    setters.setAge(29);
    expect(state.age.is).toEqual(29);
  });

  it('setters handle functions only', () => {
    expect(setters.bla).toEqual(undefined);
  });

  it('getters are accessors', () => {
    expect(getters.getName).toBeInstanceOf(Function);
    expect(getters.getName()).toEqual('Gandalf');
  });

  it('getters argumentless functions are treated normally', () => {
    expect(getNameCalled).toBe(0);
    expect(getters.getName()).toEqual('Gandalf');
    expect(getNameCalled).toBe(1);
    for (let i = 0; i < 4; i++) {
      expect(getters.getName()).toEqual('Gandalf');
    }
    expect(getNameCalled).toBe(5);
    setters.setName('bob');
    expect(getters.getName()).toEqual('bob');
    expect(getNameCalled).toBe(6);
  });

  it('getters argumentless functions are cached when observed', () => {
    expect(getNameCalled).toBe(0);
    const stop = mobx.autorun(() => getters.getName());
    expect(getNameCalled).toBe(1);
    expect(getters.getName()).toEqual('Gandalf');
    expect(getNameCalled).toBe(1);
    for (let i = 0; i < 100; i++) {
      expect(getters.getName()).toEqual('Gandalf');
    }
    expect(getNameCalled).toBe(1);
    setters.setName('bob');
    for (let i = 0; i < 100; i++) {
      expect(getters.getName()).toEqual('bob');
    }
    expect(getNameCalled).toBe(2);
    stop();
  });

  it('getters wrap argumentless functions in computed values', () => {
    expect(getters.getName).toBeInstanceOf(Function);
    expect(getters.getName()).toEqual('Gandalf');
    expect(mobx.isComputed(getters.__computed.getName)).toBe(true);
  });

  it('getters with arguments are treated normally and not cached', () => {
    expect(getFullNameCalled).toBe(0);
    expect(getters.getFullName(' ')).toEqual('Gandalf The grey');
    expect(getFullNameCalled).toBe(1);
    expect(getters.getFullName('---', '=')).toEqual('Gandalf---The grey');
    expect(getFullNameCalled).toBe(2);
  });

  it('if caching is desired, wrap the underlying call with argumentless getter', () => { // eslint-disable-line max-statements
    expect(getFullNameCalled).toBe(0);
    expect(getNameCalled).toBe(0);
    const stop = mobx.autorun(() => getters.getFullName());
    expect(getFullNameCalled).toBe(1);
    expect(getNameCalled).toBe(1);
    expect(getters.getFullName(' ')).toEqual('Gandalf The grey');
    expect(getFullNameCalled).toBe(2);
    expect(getNameCalled).toBe(1);
    expect(getters.getFullName('---', '=')).toEqual('Gandalf---The grey');
    expect(getFullNameCalled).toBe(3);
    expect(getNameCalled).toBe(1);
    setters.setName('bob');
    expect(getFullNameCalled).toBe(4); // autorun calls this
    expect(getNameCalled).toBe(2);
    expect(getters.getFullName(' ')).toEqual('bob The grey');
    expect(getFullNameCalled).toBe(5);
    expect(getNameCalled).toBe(2);
    expect(getters.getFullName(' ')).toEqual('bob The grey');
    expect(getFullNameCalled).toBe(6);
    expect(getNameCalled).toBe(2);
    stop();
  });

  it('should keep objects and arrays untouched', () => {
    const observable = remx.state({ arr: [], obj: {} });
    expect(observable.arr).toEqual([]);
    expect(observable.arr[Symbol.iterator]).toEqual([][Symbol.iterator]);
    expect(observable.obj).toEqual({});
  });

  it('trasitive changes in observable objects that are created dynamically are respected', () => {
    expect(getters.getDynamicallyCreatedKey()).toEqual('not yet set');
    setters.createKeyDynamically('Gandalf');
    expect(getters.getDynamicallyCreatedKey()).toEqual('Gandalf');
    setters.createKeyDynamically('Gandalf2');
    expect(getters.getDynamicallyCreatedKey()).toEqual('Gandalf2');
  });

  it('merge function', () => {
    expect(remx.merge).toBeInstanceOf(Function);
    expect(state.dynamicallyCreatedKeys).toEqual({});
    setters.usingMerge(`bla`);
    expect(state.dynamicallyCreatedKeys).toEqual({ foo: 'bla' });
    setters.usingMerge(undefined);
    expect(state.dynamicallyCreatedKeys).toEqual({ foo: undefined });
  });

  it('state merge with boolean addition', () => {
    expect(state.dynamicallyCreatedKeys).toEqual({});
    setters.usingMergeWithValue(false);
    expect(state.dynamicallyCreatedKeys).toEqual(false);
  });

  it('state merge with falsey', () => {
    expect(state.dynamicallyCreatedKeys).toEqual({});
    setters.usingMergeWithValue(undefined);
    expect(state.dynamicallyCreatedKeys).toEqual(undefined);
  });

  it('state merge will not remove not-overriden values', () => {
    expect(state.job.experience).toEqual('infinite');
    expect(state.job.description).toEqual(undefined);
    setters.setJobDescriptionUsingMerge('Wizard');
    expect(state.job.experience).toEqual('infinite');
    expect(state.job.description).toEqual('Wizard');
  });

  it('state merge works with non-objects', () => {
    expect(state.race).toEqual('unknown');
    setters.setRace('not human');
    expect(state.race).toEqual('not human');
  });

  it('should allow setting a complex object', () => {
    const complexName = {
      value: 'bla',
      someFunc() {
        return true;
      }
    };
    setters.setName(complexName);
    expect(getters.getName().value).toBe('bla');
    expect(getters.getName().someFunc()).toBe(true);
  });

  it('should apply changes to the state only when setter is finished', () => {
    let callCount = 0;
    mobx.autorun(() => {
      const prop1 = getters.getMultiPropObject().prop1;
      const prop2 = getters.getMultiPropObject().prop2;
      const prop3 = getters.getMultiPropObject().prop3;
      callCount++;
      return prop1 + prop2 + prop3; // fake usage to satisfy linter
    });
    setters.setMultiPropObject();
    expect(callCount).toBe(2);
  });

  describe('logger', () => {
    it('should expose a register logger function', () => {
      expect(remx.registerLoggerForDebug).toBeTruthy();
    });

    it('should warn you when registerLogger', () => {
      global.console.warn = jest.fn();
      remx.registerLoggerForDebug(jest.fn());
      expect(console.warn).toBeCalledWith('Remx logger has been activated. make sure to disable it in production.');
    });

    it('should call to logger on every setter', () => {
      const spy = jest.fn();
      remx.registerLoggerForDebug(spy);
      setters.setName('bla');
      expect(spy.mock.calls[0][0]).toEqual({ action: 'setter', name: 'setName', args: ['bla'] });
    });

    it('should call to logger on every getter', () => {
      const spy = jest.fn();
      remx.registerLoggerForDebug(spy);
      getters.getName('bla');
      expect(spy.mock.calls[0][0]).toEqual({ action: 'getter', name: 'getName', args: ['bla'] });
    });
  });

  it('should export fake toJS for migration purposes', () => {
    const consoleBackup = console.warn;
    console.warn = jest.fn();
    expect(remx.toJS).toBeDefined();
    const array = [1, 2, 3];
    expect(remx.toJS(array)).toEqual(array);
    expect(console.warn.mock.calls[0][0]).toContain('deprecate');
    console.warn = consoleBackup;
  });
});
