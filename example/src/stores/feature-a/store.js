const remx = require('remx');

const initialState = {
  foo: 'bar',
  key: 1,
  obj: {
    deep: true
  }
};

const state = remx.state(initialState);

const setters = remx.setters({
  setKey(n) {
    state.key = n;
  },

  setName(name) {
    state.obj.name = name;
  }
});

const getters = remx.getters({
  getFoo() {
    return state.foo;
  },

  getName() {
    return state.obj.name;
  }
});

module.exports = { setters, getters };
