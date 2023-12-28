import { writable, get } from 'svelte/store';

import type { IList } from '$lib/components/List.svelte';
import type { ITask } from '$lib/components/Task.svelte';
import { notifications } from '$lib/stores';
import { setCookie } from '$lib/utils';

const defaultTodos: IList[] = [];

export const todos = writable<IList[]>(defaultTodos);
export const selectedListId = writable<number | null>(null);

export const setLists = (value: IList[]) => {
	todos.set(value);
	setCookie('todos', JSON.stringify(value), 365);
};

export const addList = (newList: IList) => {
	let $toDos: IList[] = defaultTodos;
	const unsubscribe = todos.subscribe((currData) => ($toDos = currData));

	const newLists = [...$toDos, newList];
	setLists(newLists);
	// Select the recently created list.
	selectedListId.set($toDos[$toDos.length - 1].id);

	unsubscribe();
};

export const editList = (listId: IList['id'], newList: IList) => {
	const $toDos = get(todos);

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	newLists[targetListIndex] = newList;

	setLists(newLists);
};

export const editListTitle = (listId: IList['id'], newListTitle: IList['title']) => {
	const $toDos = get(todos);

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	newLists[targetListIndex].title = newListTitle;

	setLists(newLists);
};

export const removeList = (listId: IList['id']) => {
	const $toDos = get(todos);

	const currentList = $toDos.filter((list) => list.id === listId)[0];
	notifications.add('list', currentList);

	const listIndex = $toDos.findIndex((list) => list.id === listId);
	// Select the previous list (if it exists) before deleting.
	if ($toDos.length > 1 && listIndex !== 0) {
		selectedListId.set($toDos[listIndex - 1].id);
		// Select the next list (if it exists) before deleting.
	} else if ($toDos.length > 1 && listIndex === 0) {
		selectedListId.set($toDos[listIndex + 1].id);
		// Deselect the current list before deleting.
	} else {
		selectedListId.set(null);
	}

	const newLists = $toDos
		.filter((list) => list.id !== listId)
		.map((list, i) => ({
			...list,
			position: i + 1,
		}));

	setLists(newLists);
};

export const addTask = (listId: IList['id'], newTask: ITask) => {
	const $toDos = get(todos);

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	newLists[targetListIndex].tasks.push(newTask);

	setLists(newLists);
};

export const editTask = (
	listId: IList['id'],
	taskId: ITask['id'],
	newTaskTitle: ITask['title']
) => {
	const $toDos = get(todos);

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
		(task: ITask) => task.id === taskId
	);
	newLists[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle;

	setLists(newLists);
};

export const toggleTaskStatus = (listId: IList['id'], taskId: ITask['id']) => {
	const $toDos = get(todos);

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
		(task: ITask) => task.id === taskId
	);
	newLists[targetListIndex].tasks[targetTaskIndex].isDone =
		!newLists[targetListIndex].tasks[targetTaskIndex].isDone;

	setLists(newLists);
};

export const removeTask = (listId: IList['id'], taskId: ITask['id']) => {
	const $toDos = get(todos);

	const currentTask = $toDos
		.filter((list: IList) => list.id === listId)[0]
		.tasks.filter((task: ITask) => task.id === taskId)[0];
	notifications.add('task', {
		listId,
		id: currentTask.id,
		position: currentTask.position,
		title: currentTask.title,
		isDone: currentTask.isDone,
	});

	const newLists = $toDos;
	const targetListIndex = newLists.findIndex((list) => list.id === listId);
	const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
		(task: ITask) => task.id === taskId
	);
	newLists[targetListIndex].tasks.splice(targetTaskIndex, 1);
	newLists[targetListIndex].tasks.forEach((task, i) => (task.position = i + 1));

	setLists(newLists);
};
