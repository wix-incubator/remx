---
id: connect
title: connect
sidebar_label: connect
slug: /api/connect
---

### `remx.connect(mapStateToProps)(MyComponent)`
Connects a react component to the state.
This function can optionally take a mapStateToProps function, for mapping the state into props.
in `someComponent.js`:

```javascript
import React, { PureComponent } from 'react';
import { connect } from 'remx';
import { store } from './someStore';

class SomeComponent extends PureComponent {
  render() {
    return (
      <div>{this.props.selectedPostTitle}</div>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    selectedPostTitle: store.getPostById(ownProps.selectedPostId);
  };
}

export default connect(mapStateToProps)(SomeComponent);

```
