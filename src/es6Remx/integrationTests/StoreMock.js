/* istanbul ignore file */

const clone = (obj) => obj && JSON.parse(JSON.stringify(obj));

export class StoreMock {
  constructor() {
    const state = {
      person: {},
      products: {},
      dynamicObject: {}
    };

    this.setters = {
      setName(newName) {
        state.person.name = newName;
      },

      addProduct(id, product) {
        state.products[id] = product;
      },
      setDynamicObject(key, value) {
        state.dynamicObject[key] = value;
      },
      setDynamicObjectNestedValue(value) {
        state.dynamicObject.newKey.nestedKey = value;
      }
    };

    this.getters = {
      getName() {
        return state.person.name || 'nothing';
      },
      getDynamicObject() {
        return JSON.stringify(state.dynamicObject);
      },
      getProduct(id) {
        return clone(state.products[id]);
      }
    };
  }
}

export const storeInstance = new StoreMock();
