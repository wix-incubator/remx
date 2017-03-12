import React, { Component } from 'react';
import { Text } from 'react-native';

class MyComponent extends Component {
  render() {
    this.props.renderSpy();
    return (
      <Text>
        {this.props.textToRender}
      </Text>
    );
  }
}

export default MyComponent;
