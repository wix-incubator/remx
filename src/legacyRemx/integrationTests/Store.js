import * as remx from '../../legacyRemx';

export class Store {
  constructor() {
    const state = remx.state({
      simpleProp: 'bla',
      person: {},
      products: remx.map(),
      dynamicObject: {}
    });
    this.state = state; //todo: remove

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

