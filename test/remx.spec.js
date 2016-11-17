import 'jasmine-expect';
import * as remx from '../src/remx';
import * as mobx from 'mobx';
import _ from 'lodash';

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
      }
    });

    setters = remx.setters({
      bla: 'blabla',
      setName(name) {
        state.name = name;
      },
      setAge(n) {
        state.age.is = n;
      }
    });

    getters = remx.getters({
      getName() {
        getNameCalled++;
        return state.name;
      },
      getFullName(separator) {
        getFullNameCalled++;
        return getters.getName() + separator + state.lastName;
      }
    });
  });

  it('wraps observable state without impacting testability', () => {
    expect(state.name).toEqual('Gandalf');
    expect(state.lastName).toEqual('The grey');
  });

  it('enforces strict mode, no one is allowed to touch the state outside of mobx actions', () => {
    expect(() => {
      state.name = 'hi';
    }).toThrow();
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
    expect(getters.getName).toBeFunction();
    expect(getters.getName()).toEqual('Gandalf');
  });

  it('getters argumentless functions are treated normally', () => {
    expect(getNameCalled).toBe(0);
    expect(getters.getName()).toEqual('Gandalf');
    expect(getNameCalled).toBe(1);
    _.times(4, () => expect(getters.getName()).toEqual('Gandalf'));
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
    _.times(10, () => expect(getters.getName()).toEqual('Gandalf'));
    expect(getNameCalled).toBe(1);
    setters.setName('bob');
    _.times(10, () => expect(getters.getName()).toEqual('bob'));
    expect(getNameCalled).toBe(2);
    stop();
  });

  it('getters wrap argumentless functions in computed values', () => {
    expect(getters.getName).toBeFunction();
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

  it('if caching is desired, wrap the underlying call with argumentless getter', () => { //eslint-disable-line max-statements
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

  it('exposes mobx toJS', () => {
    expect(remx.toJS).toEqual(mobx.toJS);
    const observable = remx.state({arr: [], obj: {}});
    const regularArr = remx.toJS(observable.arr);
    expect(regularArr).toEqual([]);
    const regularArr2 = observable.arr.toJS();
    expect(regularArr2).toEqual([]);
    const regularObj = remx.toJS(observable.obj);
    expect(regularObj).toEqual({});
  });
});
