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
    const {
      renderSpy,
      testDynamicObject,
      store: {getters}
    } = this.props;

    renderSpy && renderSpy();

    if (getters.getProduct('123')) {
      return this.renderText(getters.getProduct('123').title);
    } else if (testDynamicObject) {
      return this.renderText(getters.getDynamicObject());
    }
    return this.renderText(getters.getName());
  }
}

MyComponent.staticMember = 'a static member';

export default MyComponent;
