/* eslint-disable react/no-multi-comp */
import _ from 'lodash';
import {Text} from 'react-native';
import React, {Component} from 'react';
import renderer from 'react-test-renderer';

import * as remx from './remx';
import {connect} from '../react-native';

describe('component auto re-rendering', () => {
  let state, mutators, selectors;
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

    mutators = remx.setters({
      setName(newName) {
        state.merge({person: {name: newName}});
      }
    });

    selectors = remx.getters({
      getName() {
        return state.person.name || 'nothing';
      }
    });
  }

  function setupComponent() {
    MyComponent = class extends Component {
      render() {
        renderSpy();
        return (<Text>{selectors.getName()}</Text>);
      }
    };

    MyConnectedComponent = connect(class extends Component {
      render() {
        renderSpy();
        const name = selectors.getName();
        return (<Text>{name}</Text>);
      }
    });
  }

  it('renders normally', () => {
    const tree = renderer.create(<MyComponent/>);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component renders normally', () => {
    const tree = renderer.create(<MyConnectedComponent/>);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('regular component does not listen to changes', () => {
    const tree = renderer.create(<MyComponent/>);
    expect(tree.toJSON().children).toEqual(['nothing']);

    mutators.setName(`Gandalf`);
    expect(selectors.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component automatically rerenders when selectors changes', () => {
    const tree = renderer.create(<MyConnectedComponent/>);
    expect(selectors.getName()).toEqual('nothing');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    mutators.setName(`Gandalf`);
    expect(selectors.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['Gandalf']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});

describe('dumb components', () => {
  let state, mutators, selectors;
  let SmartComponent, InnerDumbComponent;

  beforeEach(() => {
    setupStore();
    setupComponent();
  });

  function setupStore() {
    state = remx.state({
      person: {
        name: 'no name'
      }
    });

    mutators = remx.setters({
      setName(newName) {
        state.person.name = newName;
      }
    });

    selectors = remx.getters({
      getPerson() {
        return state.person;
      }
    });
  }

  function setupComponent() {
    InnerDumbComponent = class extends Component {
      render() {
        return (<Text>{this.props.person.name}</Text>);
      }
    };

    SmartComponent = connect(class extends Component {
      render() {
        return (<InnerDumbComponent person={selectors.getPerson()}/>);
      }
    });
  }

  it('does not update inner dumb components when using regular mutations', () => {
    const tree = renderer.create(<SmartComponent/>);
    expect(selectors.getPerson()).toEqual({name: 'no name'});
    expect(tree.toJSON().children).toEqual(['no name']);

    mutators.setName('Gandalf');
    expect(selectors.getPerson()).toEqual({name: 'Gandalf'});
    expect(tree.toJSON().children).toEqual(['no name']);
  });

  it('rerenders inner dumb components on change when using merge', () => {
    mutators = remx.setters({
      setName(newName) {
        state.merge({person: {name: newName}});
      }
    });

    const tree = renderer.create(<SmartComponent/>);
    expect(selectors.getPerson()).toEqual({name: 'no name'});
    expect(tree.toJSON().children).toEqual(['no name']);

    mutators.setName('Gandalf');
    expect(selectors.getPerson()).toEqual({name: 'Gandalf'});
    expect(tree.toJSON().children).toEqual(['Gandalf']);
  });
});

describe('smart component with map', () => {
  let state, mutators, selectors;
  let SmartComponent;

  beforeEach(() => {
    setupStore();
    setupComponent();
  });

  function setupStore() {
    state = remx.state({
      products: remx.map()
    });

    mutators = remx.setters({
      addProduct(id, product) {
        state.products.set(id, product);
      }
    });

    selectors = remx.getters({
      getProduct(id) {
        return state.products.get(id);
      }
    });
  }

  function setupComponent() {
    SmartComponent = connect(class extends Component {
      render() {
        return (<Text>{_.get(selectors.getProduct('123'), 'title', 'none')}</Text>);
      }
    });
  }

  it('using map will rerender when adding a new key', () => {
    const tree = renderer.create(<SmartComponent/>);
    expect(tree.toJSON().children).toEqual(['none']);

    mutators.addProduct('123', {title: 'my product'});
    expect(tree.toJSON().children).toEqual(['my product']);
  });
});
