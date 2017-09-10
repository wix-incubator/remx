# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

Idiomatic mobx

> Soon to be unveiled

## API usage

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
