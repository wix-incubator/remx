# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

Idiomatic mobx

> Soon to be unveiled

## API:
### State:
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

### Getters: 
All the functions that are going to return parts of the state should be wrapped within the Getters function.
The warpped getters functions shoud be defined inside the store and should be exported.

in `someStore.js`:
```javascript
import * as remx from 'remx';
export const getters = remx.getters({
 getIsLoading() {
   return state.isLoading;
 },
 getPostsByIndex(index) {
  return state.posts[index];
 }
});
```

### Setters: 
All the functions that are going to change parts of the state should be wrapped within the Setters function.
The warpped setters functions shoud be defined inside the store and should be exported.

in `someStore.js`:
```javascript
import * as remx from 'remx';
export const setters = remx.setters({
 setIsLoading(isLoading) {
   state.isLoading = isLoading;
 },
 addPost(post) {
  state.posts.push(post);
 }
});
```

### Connect:
Connects a react component to the state.
This function can optionally take a mapStateToProps function, for mapping the state into props.
in `someComponent.js`:
```javascript
import {conncet} from 'remx';
import * as store from './someStore';

class SomeComponent extends React.Component {
  render() {
    return (
      <div>{this.props.slectedPostTitle}</div>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    slectedPostTitle: store.getters.getPostById(ownProps.selectedPostId);
  };
}

export default connect(mapStateToProps)(SomeComponent);

```

## Usage Example:
### Store

in `src/stores/something/store.js`

```javascript
 import * as remx from 'remx';
 
 const state = remx.state({
    name: 'Bob',
    products: [
     {id: '1', description: 'someDescription1' },
     {id: '2', description: 'someDescription2'}
    ]
 });
 
 export const setters = remx.setters({
    setName(newName) {
      state.name = newName;
    },
    //mutable changes: remx supports mutable changes of the state.
    addNewProduct(newProduct) {
     state.products.push(newProduct);
    },
    editProductDescription(id, description) {
     const product = state.products.find(product => product.id === id);
     if(product) {
      product.description = description; //nested object mutable change
     }
    },
    //you can still change the object immutably if you want:
    removeProduct(id) {
     state.products = state.products.filter(product => product.id !== id);
    }
 });
 
 export const getters = remx.getters({
    getName() {
      return state.name;
    },
    getProducts() {
      return state.products;
    }
 });
```

### Actions

in `src/stores/something/actions.js`

```javascript

 import * as store from './store';

 export async function fetchName() {
   const newName = await fetch(...);
   store.setters.setName(newName);
 }
```

### Component

in `src/containers/MyScreen.jsx`

```javascript
  import { connect } from 'remx';
  
  import * as store from '../../stores/something/store';
  import * as actions from '../../stores/something/actions';
  
  class MyScreen extends Component {
  
    componentDidMount() {
      actions.fetchName();
    }
  
    render() {
      const name = this.props.name;
      ....
    }
  }
  
  function mapStateToProps(ownProps) {
    return {
      name: store.getters.getName()
    }
  }
  
  export default connect(mapStateToProps)(MyScreen);
```

### Remx V2 migration:

* No need for toJS: from now on Remx.state() will return a plain object. No need to for toJs anymore.

* `import {connect} from remx/react-native;` is now changed to: `import {connect} from remx`;

* There is no more merge function on the state object. 
Remx.state is now a plain object so you can use any merge function you want, or you can just mutate the state. (You can still import the merge function from remx: `import {merge} from remx`)
