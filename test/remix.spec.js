import 'jasmine-expect';
import * as remix from '../src/remix';
import * as mobx from 'mobx';
import _ from 'lodash';

describe('remix!', () => {
  let state, mutators, selectors, getNameCalled, getFullNameCalled;

  beforeEach(() => {
    getNameCalled = 0;
    getFullNameCalled = 0;
    state = remix.observableState({
      name: 'Gandalf',
      lastName: 'The grey',
      age: {
        is: 0
      }
    });

    mutators = remix.mutators({
      bla: 'blabla',
      setName(name) {
        state.name = name;
      },
      setAge(n) {
        state.age.is = n;
      }
    });

    selectors = remix.selectors({
      getName() {
        getNameCalled++;
        return state.name;
      },
      getFullName(separator) {
        getFullNameCalled++;
        return selectors.getName() + separator + state.lastName;
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

  it('mutators are wrapped in mobx action', () => {
    expect(state.name).toEqual('Gandalf');
    mutators.setName('other');
    expect(state.name).toEqual('other');
  });

  it('mutators can mutate nested objects', () => {
    expect(state.age.is).toEqual(0);
    mutators.setAge(29);
    expect(state.age.is).toEqual(29);
  });

  it('mutators handle functions only', () => {
    expect(mutators.bla).toEqual(undefined);
  });

  it('selectors are accessors', () => {
    expect(selectors.getName).toBeFunction();
    expect(selectors.getName()).toEqual('Gandalf');
  });

  it('selectors argumentless functions are treated normally', () => {
    expect(getNameCalled).toBe(0);
    expect(selectors.getName()).toEqual('Gandalf');
    expect(getNameCalled).toBe(1);
    _.times(4, () => expect(selectors.getName()).toEqual('Gandalf'));
    expect(getNameCalled).toBe(5);
    mutators.setName('bob');
    expect(selectors.getName()).toEqual('bob');
    expect(getNameCalled).toBe(6);
  });

  it('selectors argumentless functions are cached when observed', () => {
    expect(getNameCalled).toBe(0);
    const stop = mobx.autorun(() => selectors.getName());
    expect(getNameCalled).toBe(1);
    expect(selectors.getName()).toEqual('Gandalf');
    expect(getNameCalled).toBe(1);
    _.times(10, () => expect(selectors.getName()).toEqual('Gandalf'));
    expect(getNameCalled).toBe(1);
    mutators.setName('bob');
    _.times(10, () => expect(selectors.getName()).toEqual('bob'));
    expect(getNameCalled).toBe(2);
    stop();
  });

  it('selectors wrap argumentless functions in computed values', () => {
    expect(selectors.getName).toBeFunction();
    expect(selectors.getName()).toEqual('Gandalf');
    expect(mobx.isComputed(selectors.__computed.getName)).toBe(true);
  });

  it('selectors with arguments are treated normally and not cached', () => {
    expect(getFullNameCalled).toBe(0);
    expect(selectors.getFullName(' ')).toEqual('Gandalf The grey');
    expect(getFullNameCalled).toBe(1);
    expect(selectors.getFullName('---', '=')).toEqual('Gandalf---The grey');
    expect(getFullNameCalled).toBe(2);
  });

  it('if caching is desired, wrap the underlying call with argumentless getter', () => { //eslint-disable-line max-statements
    expect(getFullNameCalled).toBe(0);
    expect(getNameCalled).toBe(0);
    const stop = mobx.autorun(() => selectors.getFullName());
    expect(getFullNameCalled).toBe(1);
    expect(getNameCalled).toBe(1);
    expect(selectors.getFullName(' ')).toEqual('Gandalf The grey');
    expect(getFullNameCalled).toBe(2);
    expect(getNameCalled).toBe(1);
    expect(selectors.getFullName('---', '=')).toEqual('Gandalf---The grey');
    expect(getFullNameCalled).toBe(3);
    expect(getNameCalled).toBe(1);
    mutators.setName('bob');
    expect(getFullNameCalled).toBe(4); // autorun calls this
    expect(getNameCalled).toBe(2);
    expect(selectors.getFullName(' ')).toEqual('bob The grey');
    expect(getFullNameCalled).toBe(5);
    expect(getNameCalled).toBe(2);
    expect(selectors.getFullName(' ')).toEqual('bob The grey');
    expect(getFullNameCalled).toBe(6);
    expect(getNameCalled).toBe(2);
    stop();
  });
});
