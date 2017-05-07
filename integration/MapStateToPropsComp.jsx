import React, { Component } from 'react';
import { Text } from 'react-native';

class MyComponent extends Component {

  static staticMember = 'a static member';

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
