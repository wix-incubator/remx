import React from 'react';
import renderer from 'react-test-renderer';

['es6Remx'].forEach((version) => {
  describe(`SmartComponent (${version})`, () => {
    let MyComponent;
    let store;
    let renderSpy;
    let connect;

    beforeEach(() => {
      const Store = require('./Store').default;
      store = new Store(require(`../${version}/remx`));
      MyComponent = require('./SmartComponent').default;
      renderSpy = jest.fn();
      connect = require(`../${version}/connect`).connect;
    });

    afterEach(() => {
      delete global.__mobxInstanceCount; // prevent warnings
    });

    it('renders normally', () => {
      const tree = renderer.create(<MyComponent store={store} renderSpy={renderSpy} />);
      expect(tree.toJSON().children).toEqual(['nothing']);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('connected component renders normally', () => {
      const MyConnectedComponent = connect()(MyComponent);
      const tree = renderer.create(<MyConnectedComponent store={store} renderSpy={renderSpy} />);
      expect(tree.toJSON().children).toEqual(['nothing']);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('regular component does not listen to changes', () => {
      const tree = renderer.create(<MyComponent store={store} renderSpy={renderSpy} />);
      expect(tree.toJSON().children).toEqual(['nothing']);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      store.setters.setName(`Gandalf`);
      expect(store.getters.getName()).toEqual('Gandalf');
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(tree.toJSON().children).toEqual(['nothing']);
    });

    it('connected component automatically rerenders when selectors changes', () => {
      const MyConnectedComponent = connect()(MyComponent);
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
        const MyConnectedComponent = connect()(MyComponent);
        const tree = renderer.create(<MyConnectedComponent store={store} />);
        expect(tree.toJSON().children).toEqual(['nothing']);

        store.setters.addProduct('123', { title: 'my product' });
        expect(tree.toJSON().children).toEqual(['my product']);
      });
    });

    it('should track dynamically added keys', () => {
      const MyConnectedComponent = connect()(MyComponent);
      const tree = renderer.create(<MyConnectedComponent store={store} testDynamicObject />);
      expect(tree.toJSON().children).toEqual(['{}']);

      store.setters.setDynamicObject('newKey', 'newValue');
      expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: 'newValue' })]);
    });

    it('should track nested dynamically added keys', () => {
      const MyConnectedComponent = connect()(MyComponent);
      const tree = renderer.create(<MyConnectedComponent store={store} testDynamicObject />);
      const nestedObject = { nestedKey: 'nestedValue' };
      store.setters.setDynamicObject('newKey', nestedObject);
      expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: nestedObject })]);
      store.setters.setDynamicObjectNestedValue('someNewValue');
      expect(tree.toJSON().children).toEqual([JSON.stringify({ newKey: { nestedKey: 'someNewValue' } })]);
    });

    it('connected component has same static members as original component', () => {
      const MyConnectedComponent = connect()(MyComponent);
      expect(MyConnectedComponent.staticMember).toEqual('a static member');
    });
  });
});
