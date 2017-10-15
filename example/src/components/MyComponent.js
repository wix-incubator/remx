import React, { PureComponent } from 'react';
import { connect } from 'remx';

import * as store from './../stores/feature-a/store';
import doSomething from './../stores/feature-a/actions';

class SomeComponent extends PureComponent {

  componentDidMount() {
    doSomething();
  }

  render() {
    return (
      <div>{this.props.name}</div>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    name: store.getters.getName()
  };
}

export default connect(mapStateToProps)(SomeComponent);
