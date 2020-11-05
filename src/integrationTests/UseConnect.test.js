import React from 'react';
import renderer from 'react-test-renderer';
import { StoreMock } from './StoreMock';

['es6Remx'].forEach((version) => {
  describe(`useConnect (${version})`, () => {
    let store;
    let storeMock;
    let renderSpy;
    const remx = require(`../${version}`);
    const MyComponent = require('./UseConnectComponent').default(remx);
    const registerLoggerForDebug = remx.registerLoggerForDebug;

    beforeEach(() => {
      const Store = require('./Store').default;
      store = new Store(remx);
      storeMock = new StoreMock();
      renderSpy = jest.fn();
    });

    it('renders normally', () => {
      const tree = renderer.create(
        <MyComponent store={store} renderSpy={renderSpy} />,
      );
      expect(tree.toJSON().children).toEqual(['nothing']);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('connected component automatically rerenders when selectors changes', async () => {
      const tree = renderer.create(
        <MyComponent store={store} renderSpy={renderSpy} />,
      );

      expect(store.getters.getName()).toEqual('nothing');
      expect(tree.toJSON().children).toEqual(['nothing']);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderer.act(() => {
        store.setters.setName(`Gandalf`);
      });

      expect(store.getters.getName()).toEqual('Gandalf');
      expect(tree.toJSON().children).toEqual(['Gandalf']);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it.skip('should trigger a log event when a connected componentd re-rerendered', () => {
      renderer.create(<MyComponent store={store} renderSpy={renderSpy} />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      const spy = jest.fn();
      registerLoggerForDebug(spy);

      renderer.act(() => {
        store.setters.setName(`Gandalf`);
      });

      expect(renderSpy).toHaveBeenCalledTimes(2);

      const expectedEvents = {
        action: 'mapStateToProps',
        connectedComponentName: 'useConnect hook',
        returnValue: { dynamicObject: expect.anything(), name: 'Gandalf', product: undefined },
        triggeredEvents: [
            { action: 'getter', args: ['123'], name: 'getProduct' },
            { action: 'getter', args: [], name: 'getDynamicObject' },
            { action: 'getter', args: [], name: 'getName' }
        ]
      };
      expect(spy.mock.calls[1][0]).toEqual(expectedEvents);
    });

    describe('using remx.map', () => {
      it('detects changes on added keys', () => {
        const tree = renderer.create(<MyComponent store={store} />);
        expect(tree.toJSON().children).toEqual(['nothing']);

        renderer.act(() => {
          store.setters.addProduct('123', { title: 'my product' });
        });

        expect(tree.toJSON().children).toEqual(['my product']);
      });
    });

    it('should track dynamically added keys', () => {
      const tree = renderer.create(
        <MyComponent store={store} testDynamicObject />,
      );
      expect(tree.toJSON().children).toEqual(['{}']);

      renderer.act(() => {
        store.setters.setDynamicObject('newKey', 'newValue');
      });

      expect(tree.toJSON().children).toEqual([
        JSON.stringify({ newKey: 'newValue' })
      ]);
    });

    it('should track nested dynamically added keys', () => {
      const tree = renderer.create(
        <MyComponent store={store} testDynamicObject />,
      );
      const nestedObject = { nestedKey: 'nestedValue' };

      renderer.act(() => {
        store.setters.setDynamicObject('newKey', nestedObject);
      });

      expect(tree.toJSON().children).toEqual([
        JSON.stringify({ newKey: nestedObject })
      ]);

      renderer.act(() => {
        store.setters.setDynamicObjectNestedValue('someNewValue');
      });

      expect(tree.toJSON().children).toEqual([
        JSON.stringify({ newKey: { nestedKey: 'someNewValue' } })
      ]);
    });

    describe('dependencies', () => {
      it('should not update result on untracked values changes', () => {
        storeMock.setters.addProduct('123', { title: 'Initial' });
        const props = {
          store: storeMock,
          renderSpy
        };
        const tree = renderer.create(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual(['Initial']);

        storeMock.setters.addProduct('123', { title: 'New' });

        tree.update(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual(['Initial']);
      });

      it('should update result on untracked value changes if dependencies force to do so', () => {
        storeMock.setters.addProduct('123', { title: 'Initial' });
        const props = {
          store: storeMock,
          renderSpy,
          dependenciesSelector: (props) => [props.store.getters.getProduct('123').title]
        };
        const tree = renderer.create(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual(['Initial']);

        storeMock.setters.addProduct('123', { title: 'New' });

        tree.update(<MyComponent {...props} />);

        expect(tree.toJSON().children).toEqual(['New']);
      });
    });

    describe('errors handling', () => {
      it('should thow on error in mapStateToProps of 1st render', () => {
        const props = {
          store,
          mapStateToProps: () => {
            throw new Error('testError');
          }
        };

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(() => {
          renderer.create(<MyComponent {...props} />);
        }).toThrow('testError');

        expect(consoleSpy).toHaveBeenCalledWith(
          'Encountered an uncaught exception that was thrown by mapStateToProps in useConnect hook',
          new Error('testError')
        );
        consoleSpy.mockRestore();
      });

      it('should thow on error in mapStateToProps of update', () => {
        const props = {
          store,
          mapStateToProps: () => {
            if (props.store.getters.getProduct('123')) {
              throw new Error('testError');
            }
            return {};
          }
        };
        const tree = renderer.create(<MyComponent {...props} />);

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        renderer.act(() => {
          store.setters.addProduct('123', { title: 'my product' });
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Encountered an uncaught exception that was thrown by mapStateToProps in useConnect hook',
          new Error('testError')
        );
        consoleSpy.mockRestore();

        expect(() => {
          tree.update(<MyComponent {...props} />);
        }).toThrow('testError');
      });
    });
  });
});
