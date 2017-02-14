/* eslint-disable react/no-multi-comp */
import _ from 'lodash';
import { Text } from 'react-native';
import React, { Component } from 'react';
import renderer from 'react-test-renderer';

import * as remx from './remx';
import { connect } from '../react-native';

describe('dumb components', () => {
  let state, setters, getters;
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

    setters = remx.setters({
      setName(newName) {
        state.person.name = newName;
      }
    });

    getters = remx.getters({
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
        return (<InnerDumbComponent person={getters.getPerson()} />);
      }
    });
  }

  it('does not update inner dumb components when using regular mutations', () => {
    const tree = renderer.create(<SmartComponent />);
    expect(getters.getPerson()).toEqual({ name: 'no name' });
    expect(tree.toJSON().children).toEqual(['no name']);

    setters.setName('Gandalf');
    expect(getters.getPerson()).toEqual({ name: 'Gandalf' });
    expect(tree.toJSON().children).toEqual(['no name']);
  });

  it('rerenders inner dumb components on change when using merge', () => {
    setters = remx.setters({
      setName(newName) {
        state.merge({ person: { name: newName } });
      }
    });

    const tree = renderer.create(<SmartComponent />);
    expect(getters.getPerson()).toEqual({ name: 'no name' });
    expect(tree.toJSON().children).toEqual(['no name']);

    setters.setName('Gandalf');
    expect(getters.getPerson()).toEqual({ name: 'Gandalf' });
    expect(tree.toJSON().children).toEqual(['Gandalf']);
  });
});
