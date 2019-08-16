export default class Store {
  constructor(remx) {
    const state = remx.state({
      person: {},
      products: {},
      dynamicObject: {}
    });

    this.setters = remx.setters({
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
    });

    this.getters = remx.getters({
      getName() {
        return state.person.name || 'nothing';
      },
      getDynamicObject() {
        return JSON.stringify(state.dynamicObject);
      },
      getProduct(id) {
        return state.products[id];
      }
    });
  }
}
