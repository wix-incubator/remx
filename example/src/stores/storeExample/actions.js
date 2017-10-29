import {setters} from './store';

export function addSlot(){
  setters.addSlot();
}
export function editSlot(index, title){
  setters.editSlot(index, title);
}

export async function fetchRandomJoke(){
  const response = await fetch('http://api.icndb.com/jokes/random');
  const result = await response.json();
  setters.setJoke(result.value.joke);
}