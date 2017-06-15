# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

Idiomatic mobx

> Soon to be unveiled

## API usage

### Store

in `src/stores/MyStore.js`

```javascript
 import * as remx from 'remx';
 
 const state = remx.state({
    name: 'Bob'
 });
 
 export const setters = remx.setters({
    setName(newName) {
      state.name = newName;
    }
 });
 
 export const getters = remx.getters({
    getName() {
      return state.name;
    }
 });
```

### Component

in `src/containers/MyScreen.jsx`

```javascript
  import { connect } from 'remx/react-native';
  
  import * as store from '../stores/MyStore';
  
  class MyScreen extends Component {
    render() {
      const name = this.props.name;
      ....
    }
  }
  
  function mapStateToProps() {
    return {
      name: store.getters.name
    }
  }
  
  export default connect(mapStateToProps)(MyScreen);
```
