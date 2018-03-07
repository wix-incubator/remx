import _ from 'lodash';
import * as remx from '../../index';

const state = remx.state({
  items: [
    { text: 'first item', id: _.uniqueId() },
    { text: 'second item', id: _.uniqueId() },
    { text: 'third item', id: _.uniqueId() }
  ]
});

const setters = remx.setters({
  add(text) {
    state.items.push({ text, id: _.uniqueId() });
  }
});

const getters = remx.getters({
  getItems() {
    return _.clone(state.items);
  }
});

export default { ...setters, ...getters };
