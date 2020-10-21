---
id: getters
title: getters
sidebar_label: getters
slug: /api/getters
---

### `remx.getters(...)`
All the functions that are going to return parts of the state should be wrapped within the Getters function.
The wrapped getters functions should be defined inside the same store file and should be exported.

in `someStore.js`:

```javascript
import * as remx from 'remx';

const getters = remx.getters({
 
 isLoading() {
   return state.loading;
 },
 
 getPostsByIndex(index) {
  return state.posts[index];
 }
 
});

export const store = {
  ...getters
};
```
