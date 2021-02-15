---
id: observer
title: observer
sidebar_label: observer
slug: /api/observer
---

### `remx.observer(MyComponent)`
Makes component re-render when store data used during previous render changes.

```javascript
import { observer } from 'remx';

class SomeComponent extends React.Component {
  render() {
    return (
      <div>{store.getPostById(this.props.selectedPostId)}</div>
    );
  }
}

export default observer(SomeComponent);
```

Also works with functional components:

```javascript
import { observer } from 'remx';

export default observer(props => (
  <div>{store.getPostById(props.selectedPostId)}</div>
))
```
