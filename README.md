[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://stand-with-ukraine.pp.ua)

# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

### Remx is opinionated state-management library for React apps.

_Website with getting started and docs: [https://wix.github.io/remx/](https://wix.github.io/remx/)_

- Remx takes the redux (flux) architecture and enforces it using a small, simple, clean, and strict API:
  - `state`
  - `setters`
  - `getters`
  - `observe`
  - `useConnect`
- almost zero boilerplate
- zero impact on tests
  - can be added/removed as a plugin
  - does not impact any design decisions
- implemented with `mobx`, thus benefits from all the performance you get with
  - memoization
  - avoiding unnecessary re-renders
- uses es6 Proxies (where possible)
  - avoids mobx's Observable wrappers which can cause weird behaviour and bugs

## Installation

```
npm install remx
```

## API

- Create state

### `remx.state(initialState)`

```javascript
import * as remx from "remx";

const initialState = {
  loading: true,
  posts: {},

  selectedPosts: [],
};

const state = remx.state(initialState);
```

- Define setters and getters

### `remx.getters(...)`

```javascript
import * as remx from "remx";

const setters = remx.setters({
  setLoading(isLoading) {
    state.loading = isLoading;
  },

  addPost(post) {
    state.posts.push(post);
  },
});

const getters = remx.getters({
  isLoading() {
    return state.loading;
  },

  getPostsByIndex(index) {
    return state.posts[index];
  },
});

export const store = {
  ...setters,
  ...getters,
};
```

- Use observer to force a component to re-render if store data was used during previous render.

### `remx.observer(MyComponent)`

```javascript
import { observer } from "remx";

class SomeComponent extends React.Component {
  render() {
    return <div>{store.getPostById(this.props.selectedPostId)}</div>;
  }
}

export default observer(SomeComponent);
```

Also, works with functional components:

```javascript
import { observer } from "remx";

export default observer((props) => (
  <div>{store.getPostById(props.selectedPostId)}</div>
));
```
