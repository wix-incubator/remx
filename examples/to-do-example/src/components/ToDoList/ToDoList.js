import React, { useState } from 'react';
import { observer } from 'remx';

import { store } from '../../store/store';

import './ToDoList.css';

import ToDoTask from '../ToDoTask/ToDoTask';

const ToDoList = (props) => {
	return (
		<div>
			{store.getToDos().map((item, index) => (
				<ToDoTask key={index} text={item.text} />
			))}
		</div>
	);
};

export default observer(ToDoList);
