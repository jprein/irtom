import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
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
];
