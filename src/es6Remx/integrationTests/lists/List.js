import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';

import { connect } from '../../index';

import store from './Store';

class MyList extends Component {
  render() {
    this.props.renderSpy();
    return (
      <FlatList
        data={this.props.items}
        renderItem={this.renderItem}
        keyExtractor={(i) => i.id}
      />
    );
  }

  renderItem(params) {
    return (
      <Text>
        {params.item.text}
      </Text>
    );
  }
}

function mapStateToProps() {
  return {
    items: store.getItems()
  };
}

export default connect(mapStateToProps)(MyList);
