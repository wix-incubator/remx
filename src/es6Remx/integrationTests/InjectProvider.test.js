import React from 'react';
import renderer from 'react-test-renderer';
import { Store } from './Store';
import { Provider, inject } from '..';

describe('SmartComponent', () => {
  let MyComponent;
  let store;
  let renderSpy;

  beforeEach(() => {
    store = new Store();
    MyComponent = inject('store')(require('./SmartComponent').default);
    renderSpy = jest.fn();
  });

  it('renders normally', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <MyComponent renderSpy={renderSpy} />
      </Provider>
    );
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});

