import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';

import { connect } from '../../index';

import store from './Store';

const Item = connect()((params) => (
  <Text>
    {params.item.text}
  </Text>
));

class MyList extends Component {
  render() {
    this.props.renderSpy();
    return (
      <FlatList
        data={this.props.items}
        renderItem={this.renderItem}
        keyExtractor={(_, i) => i}
      />
    );
  }

  renderItem(params) {
    return <Item {...params} />;
  }
}

function mapStateToProps() {
  return {
    items: store.getItems()
  };
}

export default connect(mapStateToProps)(MyList);
