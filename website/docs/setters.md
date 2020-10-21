---
id: setters
title: setters
sidebar_label: setters
slug: /api/setters
---

### `remx.setters(...)`
All the functions that are going to change parts of the state should be wrapped within the Setters function.
The wrapped setters functions should be defined inside the store and should be exported.

in `someStore.js`:

```javascript
import * as remx from 'remx';

const setters = remx.setters({

 setLoading(isLoading) {
   state.loading = isLoading;
 },
 
 addPost(post) {
  state.posts.push(post);
 }
 
});

export const store = {
  ...setters
};

```
