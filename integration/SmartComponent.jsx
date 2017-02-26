import React from 'react';
import { Text } from 'react-native';

import * as store from './Store';

class MyComponent extends React.Component {
  renderPerson() {
    return (
      <Text>
        {store.getters.getName()}
      </Text>
    );
  }

  renderProduct() {
    return (
      <Text>
        {store.getters.getProduct('123').title}
      </Text>
    );
  }

  render() {
    this.props.renderSpy();
    if (store.getters.getProduct('123')) {
      return this.renderProduct();
    } else {
      return this.renderPerson();
    }
  }
}

export default MyComponent;
