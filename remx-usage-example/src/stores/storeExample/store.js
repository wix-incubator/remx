import * as remx from 'remx';
remx.registerLoggerForDebug(console.log);

const initialState = {
  randomJoke: null,
  savedJokes: [{title: 'slot0', id: '0' }]
};

const state = remx.state(initialState);
const getters = remx.getters({
  getRandomJoke() {
    return state.randomJoke;
  },
  getAllSavedJokes() {
    return state.savedJokes.map((joke) => joke.title);
  }
});

const setters = remx.setters({
  addSlot() {
    state.savedJokes.push({title: 'slot'+ state.savedJokes.length, id:  state.savedJokes.length});
  },
  editSlot(index, newTitle) {
    if(state.savedJokes[index]) {
      state.savedJokes[index].title = newTitle;
    }
  },
  setJoke(joke) {
    return state.randomJoke = joke;
  }
});

export const store = {
  ...setters,
  ...getters
};
