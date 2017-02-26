import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

import { connect } from '../react-native';

describe('SmartComponent', () => {
  let MyComponent, MyConnectedComponent;
  let store;
  let renderSpy;

  beforeEach(() => {
    store = require('./Store');
    MyComponent = require('./SmartComponent').default;
    MyConnectedComponent = connect(MyComponent);
    renderSpy = jest.fn();
  });

  it('renders normally', () => {
    const tree = renderer.create(<MyComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected component renders normally', () => {
    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  xit('regular component does not listen to changes', () => {
    const tree = renderer.create(<MyComponent renderSpy={renderSpy} />);
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName(`Gandalf`);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(tree.toJSON().children).toEqual(['nothing']);
  });

  it('connected component automatically rerenders when selectors changes', () => {
    const tree = renderer.create(<MyConnectedComponent renderSpy={renderSpy} />);
    expect(store.getters.getName()).toEqual('nothing');
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName(`Gandalf`);
    expect(store.getters.getName()).toEqual('Gandalf');
    expect(tree.toJSON().children).toEqual(['Gandalf']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});

// describe('smart component with map', () => {
//   let state, setters, getters;
//   let SmartComponent;

//   beforeEach(() => {
//   });

//   function setupStore() {
//     state = remx.state({
//       products: remx.map()
//     });

//     setters = remx.setters({
//       addProduct(id, product) {
//         state.products.set(id, product);
//       }
//     });

//     getters = remx.getters({
//       getProduct(id) {
//         return state.products.get(id);
//       }
//     });
//   }

//   function setupComponent() {
//     SmartComponent = connect(class extends Component {
//       render() {
//         return (<Text>{_.get(getters.getProduct('123'), 'title', 'none')}</Text>);
//       }
//     });
//   }

//   it('using map will rerender when adding a new key', () => {
//     const tree = renderer.create(<SmartComponent />);
//     expect(tree.toJSON().children).toEqual(['none']);

//     setters.addProduct('123', { title: 'my product' });
//     expect(tree.toJSON().children).toEqual(['my product']);
//   });
// });
