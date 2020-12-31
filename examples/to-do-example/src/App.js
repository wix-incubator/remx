import './App.css';

import RoundPlusButton from './components/RoundPlusButton/RoundPlusButton';
import ToDoList from './components/ToDoList/ToDoList';

function App() {
	return (
		<div className='App'>
			<h1>Remx To-Do Example</h1>
			<ToDoList />
			<RoundPlusButton />
		</div>
	);
}

export default App;
