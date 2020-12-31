import * as remx from 'remx';
import { registerLoggerForDebug } from 'remx';

registerLoggerForDebug(console.log);

const initialState = {
	todos: [
		{
			text: 'This is my first to-do',
		},
		{
			text: 'This is my next to-do',
		},
	],
	isLoading: false,
};

const state = remx.state(initialState);

const getters = remx.getters({
	getToDos() {
		return state.todos;
	},
});

const setters = remx.setters({
	addToDo(todo) {
		state.todos.push(todo);
	},
});

export const store = {
	...getters,
	...setters,
};
