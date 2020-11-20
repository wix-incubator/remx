---
id: useConnect
title: useConnect
sidebar_label: useConnect
slug: /api/useConnect
---

### `remx.useConnect(fn, arguments)`
Hook-style alternative to remx.connect.
It makes sure, the component is re-rendered on observable values change.
Second argument (optional) is array of arguments that will be passed to the provided function.

```javascript
import React, { PureComponent } from 'react';
import { useConnect } from 'remx';
import { store } from './someStore';

const SomeComponent = (props) => {
  const {selectedPostTitle} = useSomeComponentConnect(props);

  return (
    <div>{selectedPostTitle}</div>
  );
};

const useSomeComponentConnect = (props) => useConnect(() => ({
  selectedPostTitle: store.getPostById(props.selectedPostId);
}));

export default SomeComponent;
```

Alternative style:

```javascript
const SomeComponent = (props) => {
  const selectedPostTitle = useConnect(store.getPostById, [props.selectedPostId]);

  return (
    <div>{selectedPostTitle}</div>
  );
};
```

Note that accessing props outside of mapStateToProps won't be tracked and may cause issues with
components not being updated.

```javascript
// Bad (product.price accessing is not tracked):
const ProductPriceComponent = (props) => {
  const {product} = useConnect(() => ({
    product: store.getters.getProduct(),
  }));

  return (
    <div>Price: {product.price} USD</div>
  );
};

// Good:
const ProductPriceComponent = (props) => {
  const {price} = useConnect(() => ({
    price: store.getters.getProduct().price
  }));

  return (
    <div>Price: {price} USD</div>
  );
};
```
