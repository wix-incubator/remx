import * as remx from '../src/remx';

state = remx.state({
  person: {}
});

export const setters = remx.setters({
  setName(newName) {
    state.merge({ person: { name: newName } });
  }
});

export const getters = remx.getters({
  getName() {
    return state.person.name || 'nothing';
  }
});
