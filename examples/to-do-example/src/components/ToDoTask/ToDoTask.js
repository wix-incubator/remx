import React, { useState } from 'react';

import './ToDoTask.css';

function ToDoTask(props) {
	return (
		<div className='to-do-task'>
			<input
				type='checkbox'
				className='to-do-checkbox'
				name='to-do-checkbox'
				value={props.text}
			/>
			<p>{props.text}</p>
		</div>
	);
}

export default ToDoTask;
