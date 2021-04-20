---
id: state
title: state
sidebar_label: state
slug: /api/state
---

### `remx.state(initialState)`
The state function takes a plain object and makes it observable.
The state should be defined inside the store, and should not be exported. All the interactions with the state should be done through exported getters and setters.

Any change to the state will trigger a re-render of any connected react component that's supposed to be affected by the change. If, for example, you have a state with two props, *A* and *B*, and you have a connected component that's using only prop *A*, only changes to prop *A* will triger re-render of the component.

in `someStore.js`:
```javascript
import * as remx from 'remx';

const initialState = {
  loading: true,
  posts: {},
  selectedPosts: [],
};

const state = remx.state(initialState);
```
