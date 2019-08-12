import * as remx from '../../index';

const uniqueId = () => Math.random().toString(32).slice(2);

const state = remx.state({
  items: [
    { text: 'first item', id: uniqueId() },
    { text: 'second item', id: uniqueId() },
    { text: 'third item', id: uniqueId() }
  ]
});

const setters = remx.setters({
  add(text) {
    state.items.push({ text, id: uniqueId() });
  }
});

const getters = remx.getters({
  getItems() {
    return state.items.slice(0);
  }
});

export default { ...setters, ...getters };
