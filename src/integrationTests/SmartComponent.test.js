import React from 'react';
import renderer from 'react-test-renderer';
import { grabConsoleWarns, grabConsoleErrors } from '../utils/testUtils';
import Store from './Store';
import * as remx from '../es6Remx';
import MyComponent from './SmartComponent';

const MyConnectedComponent = remx.observer(MyComponent);

describe(`SmartComponent`, () => {
  let store;
  let renderSpy;

  beforeEach(() => {
    store = new Store(remx);
    renderSpy = jest.fn();
  });

  afterEach(() => {
    delete global.__mobxInstanceCount; // prevent warnings
  });

  it('renders normally', () => {
    let tree;
    expect(grabConsoleErrors(() => tree = renderer.create(<MyComponent store={store} renderSpy={renderSpy} />)));
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component renders normally', () => {
    const tree = renderer.create(<MyConnectedComponent store={store} renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  describe('warning on accessing state in untracked React components', () => {
    beforeEach(() => {
      remx.setAccessStateStrictMode(true);
    });

    it('doesn\'t mode if strict mode is disabled warns', () => {
      remx.setAccessStateStrictMode(false);
      expect(grabConsoleErrors(() => renderer.create(<MyComponent store={store} renderSpy={renderSpy} />)))
        .toEqual([]);
    });

    it('doesn\'t warn on accessing state outside of React component', () => {
      expect(grabConsoleErrors(() => store.getters.getProduct('0'))).toEqual([]);
    });

    it.skip('not connected classic component warns', () => {
      expect(grabConsoleErrors(() => renderer.create(<MyComponent store={store} renderSpy={renderSpy} />)))
        .toEqual([
          ['[REMX] attempted to access prop \'products\' in react component untracked by remx'],
          ['[REMX] attempted to access prop \'123\' in react component untracked by remx'],
          ['[REMX] attempted to access prop \'person\' in react component untracked by remx'],
          ['[REMX] attempted to access prop \'name\' in react component untracked by remx']
        ]);
    });

    it('connected classic component doesn\'t warn', () => {
      expect(grabConsoleErrors(() =>
        renderer.create(<MyConnectedComponent store={store} renderSpy={renderSpy} />))
      )
          .toEqual([]);
    });

    it('not connected functional component warns', () => {
      const Fc = () => store.getters.getProduct('0') || null;
      expect(grabConsoleErrors(() => renderer.create(<Fc />)))
        .toEqual([
          ['[REMX] attempted to access prop \'products\' in react component untracked by remx'],
          ['[REMX] attempted to access prop \'0\' in react component untracked by remx']
        ]);
    });

    it('connected functional component doesn\'t warn', () => {
      const Fc = () => store.getters.getProduct('0') || null;
      const ConnectedFC = remx.observer(Fc);
      expect(grabConsoleErrors(() => renderer.create(<ConnectedFC />))).toEqual([]);
    });

    it('not connected forwardRef component warns', () => {
      const FcFw = React.forwardRef(() => store.getters.getProduct('0') || null);
      expect(grabConsoleErrors(() => renderer.create(<FcFw />)))
        .toEqual([
          ['[REMX] attempted to access prop \'products\' in react component untracked by remx'],
          ['[REMX] attempted to access prop \'0\' in react component untracked by remx']
        ]);
    });

    it('connected forwardRef component doesn\'t warn', () => {
      const FcFw = React.forwardRef(() => store.getters.getProduct('0') || null);
      const ConnectedFCFW = remx.observer(FcFw);
      expect(grabConsoleErrors(() => renderer.create(<ConnectedFCFW />))).toEqual([]);
    });
  });

  it.skip('regular component does not listen to changes', () => {
    let tree;
    expect(grabConsoleErrors(() => tree = renderer.create(<MyComponent store={store} renderSpy={renderSpy} />)));
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName(`Gandalf`);
    expect(store.getters.getName()).toEqual('Gandalf');
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(tree.toJSON().children).toEqual(['nothing']);
  });

  it('connected component automatically rerenders when selectors changes', () => {
    const tree = renderer.create(<MyConnectedComponent store={store} renderSpy={renderSpy} />);

    expect(store.getters.getName()).toEqual('nothing');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName(`Gandalf`);
    expect(store.getters.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['Gandalf']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  describe('using remx.map', () => {
    it('detects changes on added keys', () => {
      const tree = renderer.create(<MyConnectedComponent store={store} />);
      expect(tree.toJSON().children).toEqual(['nothing']);

      store.setters.addProduct('123', { title: 'my product' });
      expect(tree.toJSON().children).toEqual(['my product']);
    });
  });

  it('should track dynamically added keys', () => {
    const tree = renderer.create(<MyConnectedComponent store={store} testDynamicObject />);
    expect(tree.toJSON().children).toEqual(['{}']);

    store.setters.setDynamicObject('newKey', 'newValue');
    expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: 'newValue' })]);
  });

  it('should track nested dynamically added keys', () => {
    const tree = renderer.create(<MyConnectedComponent store={store} testDynamicObject />);
    const nestedObject = { nestedKey: 'nestedValue' };
    store.setters.setDynamicObject('newKey', nestedObject);
    expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: nestedObject })]);
    store.setters.setDynamicObjectNestedValue('someNewValue');
    expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: { nestedKey: 'someNewValue' } })]);
  });

  it('connected component has same static members as original component', () => {
    expect(MyConnectedComponent.staticMember).toEqual('a static member');
  });

  it('warns about deprecated connect()(component) approach once', () => {
    expect(grabConsoleWarns(() => remx.connect()(() => null)))
      .toEqual([['[remx] connect()(component) is deprecated, use observer(component) instead']]);
    expect(grabConsoleWarns(() => remx.connect()(() => null))).toEqual([]);
  });
});
