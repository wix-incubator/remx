import _ from 'lodash';
import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import MyList from './List';

import store from './Store';

describe('List support', () => {
  let renderSpy;
  beforeEach(() => {
    renderSpy = jest.fn();
  });

  it('renders list initially once', () => {
    expect(store.getItems().length).toEqual(3);

    const tree = renderer.create(<MyList renderSpy={renderSpy} />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(getRenderedTexts(tree)).toEqual(['first item', 'second item', 'third item']);
  });

  it('re-renders list on item pushed to array', () => {
    expect(store.getItems().length).toEqual(3);

    const tree = renderer.create(<MyList renderSpy={renderSpy} />);
    expect(getRenderedTexts(tree)).toEqual(['first item', 'second item', 'third item']);

    store.add('new item');
    expect(store.getItems().length).toEqual(4);

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(getRenderedTexts(tree)).toEqual(['first item', 'second item', 'third item', 'new item']);
  });
});

function getRenderedTexts(tree) {
  const childTexts = tree.root.findAllByType(Text);
  return _.map(childTexts, (child) => child.instance.props.children);
}
