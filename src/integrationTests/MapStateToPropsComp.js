import React, { Component } from 'react';
import { Text } from 'react-native';

class MyComponent extends Component {
  static get options() {
    return {};
  }

  render() {
    if (this.props.renderSpy) {
      this.props.renderSpy();
    }
    return this.props.product ? (
      <Text>
        {this.props.product.title}
      </Text>
    ) : (
      <Text>
        {this.props.textToRender}
      </Text>
    );
  }
}

MyComponent.staticMember = 'a static member';
export default MyComponent;
