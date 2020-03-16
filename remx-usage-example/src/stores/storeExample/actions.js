import { store } from './store';

export function addSlot() {
  store.addSlot();
}
export function editSlot(index, title) {
  store.editSlot(index, title);
}

export async function fetchRandomJoke() {
  const response = await fetch('http://api.icndb.com/jokes/random');
  const result = await response.json();
  store.setJoke(result.value.joke);
}
