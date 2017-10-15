const remx = require('remx');

const initialState = {
  name: 'bla'
};

const state = remx.state(initialState);

const setters = remx.setters({
  setName(n) {
    state.name = n;
  }
});

const getters = remx.getters({
  getName() {
    return state.name;
  }
});

module.exports = { setters, getters };
