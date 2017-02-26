import * as remx from '../src/remx';

state = remx.state({
  person: {},
  products: remx.map()
});

export const setters = remx.setters({
  setName(newName) {
    state.merge({ person: { name: newName } });
  },

  addProduct(id, product) {
    state.products.set(id, product);
  }
});

export const getters = remx.getters({
  getName() {
    return state.person.name || 'nothing';
  },

  getProduct(id) {
    return state.products.get(id);
  }
});
