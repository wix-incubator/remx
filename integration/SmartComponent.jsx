import React, { Component } from 'react';
import { Text } from 'react-native';

import * as store from './Store';

class MyComponent extends Component {

  static staticMember = 'a static member';

  renderText(txt) {
    return (
      <Text>
        {txt}
      </Text>
    );
  }

  render() {
    if (this.props.renderSpy) {
      this.props.renderSpy();
    }

    if (store.getters.getProduct('123')) {
      return this.renderText(store.getters.getProduct('123').title);
    } else {
      return this.renderText(store.getters.getName());
    }
  }
}

export default MyComponent;
