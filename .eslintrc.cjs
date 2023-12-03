module.exports = {
	root: true,
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	/**
	 * In order to display Prettier errors through ESLint, 'plugin:prettier/recommended' is added in the property below.
	 * Switch it for 'prettier' and remove 'eslint-plugin-prettier' from 'plugins' if you do not wish this behavior
	 * (the 'eslint-plugin-prettier' dependency can be removed too).
	 */
	extends: ['plugin:svelte/prettier', 'plugin:prettier/recommended'],
	plugins: ['eslint-plugin-prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
};
