import React, { useState } from 'react';

import './ToDoList.css';

import ToDoTask from '../ToDoTask/ToDoTask';

function ToDoList() {
	return (
		<div className='to-do-list-wrapper'>
			<ToDoTask text='This is my to-do' />
		</div>
	);
}

export default ToDoList;
