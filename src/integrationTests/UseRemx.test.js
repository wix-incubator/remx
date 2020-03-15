import React from 'react';
import renderer from 'react-test-renderer';
import { StoreMock } from './StoreMock';

['es6Remx', 'legacyRemx'].forEach((version) => {
  describe(`useRemxValue (${version})`, () => {
    let store;
    let storeMock;
    let renderSpy;
    const remx = require(`../${version}`);
    const MyComponent = require('./UseRemxComponent').default(remx);
    const registerLoggerForDebug = remx.registerLoggerForDebug;

    beforeEach(() => {
      const Store = require('./Store').default;
      store = new Store(remx);
      storeMock = new StoreMock();
      renderSpy = jest.fn();
    });

    it('renders normally', () => {
      const tree = renderer.create(
        <MyComponent store={store} renderSpy={renderSpy} productId="123"/>,
      );
      expect(tree.toJSON().children).toEqual([getExpectedValue()]);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('connected component automatically rerenders when selectors changes', async () => {
      const tree = renderer.create(
        <MyComponent store={store} renderSpy={renderSpy} productId="123"/>,
      );

      expect(store.getters.getName()).toEqual('nothing');
      expect(tree.toJSON().children[0]).toEqual(expect.stringContaining(getExpectedValue()));
      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderer.act(() => {
        store.setters.setName(`Gandalf`);
      });

      expect(store.getters.getName()).toEqual('Gandalf');
      expect(tree.toJSON().children[0]).toEqual(getExpectedValue({ name: 'Gandalf' }));
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('should trigger a log event when a connected component re-rerendered', () => {
      renderer.create(<MyComponent store={store} renderSpy={renderSpy} productId="123"/>);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      const spy = jest.fn();
      registerLoggerForDebug(spy);

      renderer.act(() => {
        store.setters.setName(`Gandalf`);
      });

      expect(renderSpy).toHaveBeenCalledTimes(2);

      const expectedEvent = {
        action: 'mapStateToProps',
        connectedComponentName: 'useRemx hook',
        returnValue: 'Gandalf',
        triggeredEvents: [
          { action: 'getter', args: [], name: 'getName' }
        ]
      };
      const callNumber = version === 'es6Remx' ? 1 : 2;
      expect(spy.mock.calls[callNumber][0]).toEqual(expectedEvent);
    });

    describe('using remx.map', () => {
      it('detects changes on added keys', () => {
        const tree = renderer.create(<MyComponent store={store} productId="123"/>);
        expect(tree.toJSON().children).toEqual([getExpectedValue()]);

        renderer.act(() => {
          store.setters.addProduct('123', { title: 'my product' });
        });

        expect(tree.toJSON().children).toEqual([getExpectedValue({ product: { title: 'my product' } })]);
      });
    });

    it('should track dynamically added keys', () => {
      const tree = renderer.create(
        <MyComponent store={store} testDynamicObject productId="123" />,
      );
      expect(tree.toJSON().children).toEqual([getExpectedValue()]);

      renderer.act(() => {
        store.setters.setDynamicObject('newKey', 'newValue');
      });

      expect(tree.toJSON().children).toEqual([getExpectedValue({ dynamicObject: { newKey: 'newValue' } })]);
    });

    it('should track nested dynamically added keys', () => {
      const tree = renderer.create(
        <MyComponent store={store} testDynamicObject />,
      );
      const nestedObject = { nestedKey: 'nestedValue' };

      renderer.act(() => {
        store.setters.setDynamicObject('newKey', nestedObject);
      });

      expect(tree.toJSON().children).toEqual([getExpectedValue({ dynamicObject: { newKey: nestedObject } })]);

      renderer.act(() => {
        store.setters.setDynamicObjectNestedValue('someNewValue');
      });

      expect(tree.toJSON().children).toEqual([getExpectedValue({ dynamicObject: { newKey: { nestedKey: 'someNewValue' } } })]);
    });

    describe('dependencies', () => {
      it('should not update result on untracked values changes', () => {
        storeMock.setters.addProduct('123', { title: 'Initial' });
        const props = {
          store: storeMock,
          renderSpy,
          productId: '123'
        };
        const tree = renderer.create(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual([getExpectedValue({ product: { title: 'Initial' } })]);

        storeMock.setters.addProduct('123', { title: 'New' });

        tree.update(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual([getExpectedValue({ product: { title: 'Initial' } })]);
      });
    });

    describe('errors handling', () => {
      it('should throw on error in 1st render', () => {
        store.getters.getProduct = () => {
          throw new Error('Help!');
        };
        const props = {
          store
        };

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(() => {
          renderer.create(<MyComponent {...props} />);
        }).toThrow('Help!');

        expect(consoleSpy).toHaveBeenCalledWith(
          'Encountered an uncaught exception that was thrown in useRemx hook',
          new Error('Help!')
        );
        consoleSpy.mockRestore();
      });

      it('should thow on error in mapStateToProps of update', () => {
        const savedGetName = store.getters.getName;
        store.getters.getName = jest.fn();
        store.getters.getName.mockImplementationOnce(savedGetName);
        store.getters.getName.mockImplementationOnce(() => {
          throw new Error('Help!');
        });
        const props = {
          store
        };
        const tree = renderer.create(<MyComponent {...props} />);

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        renderer.act(() => {
          store.setters.setName('abc');
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Encountered an uncaught exception that was thrown in useRemx hook',
          new Error('Help!')
        );
        consoleSpy.mockRestore();

        expect(() => {
          tree.update(<MyComponent {...props} />);
        }).toThrow('Help!');
      });
    });
  });
});

function getExpectedValue({ name = 'nothing', dynamicObject = {}, product = undefined } = {}) {
  return JSON.stringify({ name, dynamicObject: JSON.stringify(dynamicObject), product });
}
