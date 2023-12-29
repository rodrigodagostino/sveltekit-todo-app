import { writable, type Updater } from 'svelte/store';
import cloneDeep from 'lodash.clonedeep';

import { browser } from '$app/environment';
import type { IList } from '$lib/components/List.svelte';
import type { ITask } from '$lib/components/Task.svelte';
import { notifications, selectedListId } from '$lib/stores';
import { setCookie } from '$lib/utils';

function createListsStore() {
	const { subscribe, set, update } = writable<IList[]>([]);

	function setLists(value: IList[]) {
		setStorage(value);
		set(value);
	}

	function updateLists(updater: Updater<IList[]>) {
		update((currValue) => {
			const newValue = updater(currValue);
			setStorage(newValue);

			return newValue;
		});
	}

	function setStorage(value: IList[]) {
		if (!browser) return;

		setCookie('lists', JSON.stringify(value), 365);
	}

	function addList(newList: IList) {
		updateLists((value) => {
			const newLists = [...value, newList];

			// Select the recently created list.
			selectedListId.set(newLists[newLists.length - 1].id);

			return newLists;
		});
	}

	function editList(listId: IList['id'], editedList: IList) {
		updateLists((value) => {
			const newLists = cloneDeep(value);
			const targetListIndex = newLists.findIndex((list) => list.id === listId);
			newLists[targetListIndex] = editedList;

			return newLists;
		});
	}

	function removeList(listId: IList['id']) {
		updateLists((value) => {
			const currentList = value.filter((list) => list.id === listId)[0];
			notifications.add('list', currentList);

			const listIndex = value.findIndex((list) => list.id === listId);
			// Select the previous list (if it exists) before deleting.
			if (value.length > 1 && listIndex !== 0) {
				selectedListId.set(value[listIndex - 1].id);
				// Select the next list (if it exists) before deleting.
			} else if (value.length > 1 && listIndex === 0) {
				selectedListId.set(value[listIndex + 1].id);
				// Deselect the current list before deleting.
			} else {
				selectedListId.set(null);
			}

			const newLists = cloneDeep(value)
				.filter((list) => list.id !== listId)
				.map((list, i) => ({
					...list,
					position: i + 1,
				}));

			return newLists;
		});
	}

	function addTask(listId: IList['id'], newTask: ITask) {
		updateLists((value) => {
			const newLists = cloneDeep(value);
			const targetListIndex = newLists.findIndex((list) => list.id === listId);
			newLists[targetListIndex].tasks.push(newTask);

			return newLists;
		});
	}

	function toggleTaskStatus(listId: IList['id'], taskId: ITask['id']) {
		updateLists((value) => {
			const newLists = cloneDeep(value);
			const targetListIndex = newLists.findIndex((list) => list.id === listId);
			const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
				(task: ITask) => task.id === taskId
			);
			newLists[targetListIndex].tasks[targetTaskIndex].isDone =
				!newLists[targetListIndex].tasks[targetTaskIndex].isDone;

			return newLists;
		});
	}

	function editTask(listId: IList['id'], taskId: ITask['id'], newTaskTitle: ITask['title']) {
		updateLists((value) => {
			const newLists = cloneDeep(value);
			const targetListIndex = newLists.findIndex((list) => list.id === listId);
			const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
				(task: ITask) => task.id === taskId
			);
			newLists[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle;

			return newLists;
		});
	}

	function removeTask(listId: IList['id'], taskId: ITask['id']) {
		updateLists((value) => {
			const currentTask = cloneDeep(value)
				.filter((list: IList) => list.id === listId)[0]
				.tasks.filter((task: ITask) => task.id === taskId)[0];
			notifications.add('task', {
				listId,
				id: currentTask.id,
				position: currentTask.position,
				title: currentTask.title,
				isDone: currentTask.isDone,
			});

			const newLists = cloneDeep(value);
			const targetListIndex = newLists.findIndex((list) => list.id === listId);
			const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
				(task: ITask) => task.id === taskId
			);
			newLists[targetListIndex].tasks.splice(targetTaskIndex, 1);
			newLists[targetListIndex].tasks.forEach((task, i) => (task.position = i + 1));

			return newLists;
		});
	}

	return {
		subscribe,
		set: setLists,
		addList,
		editList,
		removeList,
		addTask,
		toggleTaskStatus,
		editTask,
		removeTask,
	};
}

export default createListsStore();
