import * as remx from 'remx';

remx.registerLoggerForDebug(console.log);

const initialState = {
    count: 0
};

const state = remx.state(initialState);
const getters = remx.getters({
  getCount() {
    return state.count;
  }
});

const setters = remx.setters({
  incCount() {
    state.count += 1
  },
  decCount() {
    state.count -= 1
  }
});

export const store = {
  ...setters,
  ...getters
};
