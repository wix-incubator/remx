import React, { Component } from 'react';

import { Text } from '../utils/testUtils';

class MyComponent extends Component {
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

    if (this.props.store.getters.getProduct('123')) {
      return this.renderText(this.props.store.getters.getProduct('123').title);
    } else if (this.props.testDynamicObject) {
      return this.renderText(this.props.store.getters.getDynamicObject());
    }
    return this.renderText(this.props.store.getters.getName());
  }
}
MyComponent.staticMember = 'a static member';

export default MyComponent;
