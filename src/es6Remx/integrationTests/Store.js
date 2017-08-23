import * as remx from '../../es6Remx';

export class Store {
  constructor() {
    const state = remx.state({
      person: {},
      products: remx.map(),
      dynamicObject: {}
    });

    this.setters = remx.setters({
      setName(newName) {
        state.person.name = newName;
      },

      addProduct(id, product) {
        state.products.set(id, product);
      },
      setDynamicObject(key, value) {
        state.dynamicObject[key] = value;
      },
      setDynamicObjectNestedValue(value) {
        state.dynamicObject.newKey.nestedKey = value;
      }
    });

    this.getters = remx.getters({
      getName() {
        return state.person.name || 'nothing';
      },
      getDynamicObject() {
        return state.dynamicObject;
      },
      getProduct(id) {
        return state.products.get(id);
      }
    });
  }
}

export const storeInstance = new Store();
