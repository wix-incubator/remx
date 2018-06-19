import React, { Component } from 'react';
import { Text } from 'react-native';

class MyComponent extends Component {
  render() {
    if (this.props.renderSpy) {
      this.props.renderSpy();
    }
    return (
      <Text>
        {this.props.textToRender}
      </Text>
    );
  }
}
MyComponent.staticMember = 'a static member';
export default MyComponent;
