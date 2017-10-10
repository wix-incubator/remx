# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

Idiomatic mobx

> Soon to be unveiled

## API:
### `remx.state(initialState)`:
The state function takes a plain object and makes it observable.
The state should be defined inside the store, and should not be exported. All the interactions with the state should be done 
through exported getters and setters.
Any change to the state will trigger a re-render of any connected react component that should be effected from the change. If for example you have a state with two props, *A* and *B*, and you have a connected component that is using only prop *A*, only changes to prop *A* will triger re-render of the component.

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

### `remx.getters(...)`: 
All the functions that are going to return parts of the state should be wrapped within the Getters function.
The warpped getters functions shoud be defined inside the same store file and should be exported.

in `someStore.js`:
```javascript
import * as remx from 'remx';

export const getters = remx.getters({
 
 isLoading() {
   return state.loading;
 },
 
 getPostsByIndex(index) {
  return state.posts[index];
 }
 
});
```

### `remx.setters(...)`: 
All the functions that are going to change parts of the state should be wrapped within the Setters function.
The warpped setters functions shoud be defined inside the store and should be exported.

in `someStore.js`:
```javascript
import * as remx from 'remx';

export const setters = remx.setters({

 setLoading(isLoading) {
   state.loading = isLoading;
 },
 
 addPost(post) {
  state.posts.push(post);
 }
 
});
```

### `remx.connect(mapStateToProps)(MyComponent)`:
Connects a react component to the state.
This function can optionally take a mapStateToProps function, for mapping the state into props.
in `someComponent.js`:
```javascript
import React, { PureComponent }
import { connect } from 'remx';
import * as store from './someStore';

class SomeComponent extends PureComponent {
  render() {
    return (
      <div>{this.props.selectedPostTitle}</div>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    selectedPostTitle: store.getters.getPostById(ownProps.selectedPostId);
  };
}

export default connect(mapStateToProps)(SomeComponent);

```
