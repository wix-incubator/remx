/* eslint-disable react/no-multi-comp */
import _ from 'lodash';
import { Text } from 'react-native';
import React, { Component } from 'react';
import renderer from 'react-test-renderer';

import * as remx from './remx';
import { connect } from '../react-native';

describe('smart components', () => {
  let state, setters, getters;
  let MyComponent, MyConnectedComponent;
  let renderSpy;

  beforeEach(() => {
    renderSpy = jest.fn();
    setupStore();
    setupComponent();
  });

  function setupStore() {
    state = remx.state({
      person: {}
    });

    setters = remx.setters({
      setName(newName) {
        state.merge({ person: { name: newName } });
      }
    });

    getters = remx.getters({
      getName() {
        return state.person.name || 'nothing';
      }
    });
  }

  function setupComponent() {
    MyComponent = class extends Component {
      render() {
        renderSpy();
        return (<Text>{getters.getName()}</Text>);
      }
    };

    MyConnectedComponent = connect(class extends Component {
      render() {
        renderSpy();
        const name = getters.getName();
        return (<Text>{name}</Text>);
      }
    });
  }

  it('renders normally', () => {
    const tree = renderer.create(<MyComponent />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component renders normally', () => {
    const tree = renderer.create(<MyConnectedComponent />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('regular component does not listen to changes', () => {
    const tree = renderer.create(<MyComponent />);
    expect(tree.toJSON().children).toEqual(['nothing']);

    setters.setName(`Gandalf`);
    expect(getters.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component automatically rerenders when selectors changes', () => {
    const tree = renderer.create(<MyConnectedComponent />);
    expect(getters.getName()).toEqual('nothing');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    setters.setName(`Gandalf`);
    expect(getters.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['Gandalf']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});

describe('smart component with map', () => {
  let state, setters, getters;
  let SmartComponent;

  beforeEach(() => {
    setupStore();
    setupComponent();
  });

  function setupStore() {
    state = remx.state({
      products: remx.map()
    });

    setters = remx.setters({
      addProduct(id, product) {
        state.products.set(id, product);
      }
    });

    getters = remx.getters({
      getProduct(id) {
        return state.products.get(id);
      }
    });
  }

  function setupComponent() {
    SmartComponent = connect(class extends Component {
      render() {
        return (<Text>{_.get(getters.getProduct('123'), 'title', 'none')}</Text>);
      }
    });
  }

  it('using map will rerender when adding a new key', () => {
    const tree = renderer.create(<SmartComponent />);
    expect(tree.toJSON().children).toEqual(['none']);

    setters.addProduct('123', { title: 'my product' });
    expect(tree.toJSON().children).toEqual(['my product']);
  });
});
