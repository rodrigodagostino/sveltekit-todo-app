# SvelteKit Todo App

This is a simple to-do app built using SvelteKit. It allows users to create multiple lists of pending tasks, which can be reordered, marked as done, renamed and deleted. All the information is stored locally so users can pick up where they left off.

## Getting Started

To run this app on your local machine, you will need to have [Node.js](https://nodejs.org/) installed.

1. Clone this repository:

```bash
git clone https://github.com/rodrigodagostino/sveltekit-todo-app.git
```

2. Navigate to the project directory and install the dependencies:

```bash
cd sveltekit-todo-app
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The app should now be running on http://localhost:5173.

## Usage

To use the app, simply add a new list by typing a name into the input field and pressing **Enter** or the **Plus** button next to it. After that, you can create your tasks by typing into the input field inside your new list and pressing again **Enter** or the **Plus** button.

You can mark tasks as completed by clicking the checkbox next to each task. To switch a list or task position, grab it from the handle on its left side and move it to the desired position. To rename a list or task, press the **Pencil** button next to it. To delete a list or task, press the **Trashcan** button next to it.

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request. We welcome contributions of all kinds, including bug fixes, feature additions, and documentation improvements.

## License

This project is licensed under the [MIT License](https://github.com/rodrigodagostino/sveltekit-todo-app/blob/master/LICENSE).
