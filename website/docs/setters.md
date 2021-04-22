---
id: setters
title: setters
sidebar_label: setters
slug: /api/setters
---

### `remx.setters(...)`
All functions that change parts of the state should be wrapped within the Setters function.
The wrapped functions should be defined inside the store and should be exported.

in `someStore.js`:

```javascript
import * as remx from 'remx';

const setters = remx.setters({
 setLoading(isLoading) {
   state.loading = isLoading;
 },
 addPost(post) {
  state.posts.push(post);
 },
});

export const store = {
  ...setters
};
```
