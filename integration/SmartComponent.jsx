import React from 'react';
import { Text } from 'react-native';

import * as store from './Store';

class MyComponent extends React.Component {
  render() {
    if (this.props.renderSpy) {
      this.props.renderSpy();
    }
    return (
      <Text>{store.getters.getName()}</Text>
    );
  }
}

export default MyComponent;
