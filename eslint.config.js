import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,html}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	...tseslint.config({
		rules: {
			'@typescript-eslint/no-explicit-any': 'off', // bad pattern but needed for custom.d.ts
		},
	}),
	{
		ignores: ['**/dist/*'],
	},
	// Add Prettier integration
	{
		plugins: { prettier: prettierPlugin },
		// Show Prettier issues as ESLint errors
		rules: {
			'prettier/prettier': 'error',
		},
	},
	// Disable ESLint rules that conflict with Prettier
	prettier,
];
