import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

import { connect } from '../react-native';

describe('SmartComponent', () => {
  let MyComponent, MyConnectedComponent;
  let store;
  let renderSpy;

  beforeEach(() => {
    store = require('./Store');
    MyComponent = require('./SmartComponent').default;
    MyConnectedComponent = connect(MyComponent);
    renderSpy = jest.fn();
  });

  it('renders normally', () => {
    const tree = renderer.create(<MyComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component renders normally', () => {
    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  xit('regular component does not listen to changes', () => {
    const tree = renderer.create(<MyComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName(`Gandalf`);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(tree.toJSON().children).toEqual(['nothing']);
  });

  it('connected component automatically rerenders when selectors changes', () => {
    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
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
      const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
      expect(tree.toJSON().children).toEqual(['nothing']);

      store.setters.addProduct('123', { title: 'my product' });
      expect(tree.toJSON().children).toEqual(['my product']);
    });
  });
});
