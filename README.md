# remx [![Build Status](https://travis-ci.org/wix/remx.svg?branch=master)](https://travis-ci.org/wix/remx)

Idiomatic mobx

> Soon to be unveiled

## API usage

### Store

in `src/stores/something/store.js`

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

### Actions

in `src/stores/something/actions.js`

```javascript
 export async function fetchName() {
   ....
 }
```

### Component

in `src/containers/MyScreen.jsx`

```javascript
  import { connect } from 'remx/react-native';
  
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
      name: store.getters.name
    }
  }
  
  export default connect(mapStateToProps)(MyScreen);
```
