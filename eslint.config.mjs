import antfu from '@antfu/eslint-config'
import boundaries from 'eslint-plugin-boundaries'
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default antfu({
	type: "app",
	react: true,
	typescript: {
		tsconfigPath: 'tsconfig.json',
	},
	formatters: true,
	stylistic: {
		indent: 'tab',
		semi: true,
		quotes: "double",
	},
	ignores: [
		'**/node_modules/**',
		'**/*.css',
		'**/*.+(lock|md|json|txt|svg|png|jpg|jpeg|gif|webp|config)',
		'**/dist/**',
		'.vscode/**',
		'commitlint.config.ts',
		'eslint.config.mjs',
		'lint-staged.config.js',
		'postcss.config.ts',
		'vite.config.js',
		'tsconfig.json',
		'index.html',
	],
}, {
	plugins: {
		'@typescript-eslint': typescriptEslint,
	},
	files: ['**/*.{ts,tsx}'],
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			project: true,
			tsconfigRootDir: import.meta.dirname
		}
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': 'off',
		'ts/no-unsafe-call': 'off',
	},
}, {
	rules: {
		"ts/no-redeclare": "off",
		"ts/consistent-type-definitions": ["error", "type"],
		"ts/no-unsafe-return": "off",
		
		"no-console": ["warn"],
		"antfu/no-top-level-await": ["off"],
		"node/prefer-global/process": ["off"],
		"node/no-process-env": ["error"],
		"perfectionist/sort-imports": ["error", {
			tsconfigRootDir: '.',
		}],
		"unicorn/filename-case": ["error", {
			case: "kebabCase",
			ignore: ["README.md"],
		}],
	},
},{
	plugins: {
		boundaries,
	},
	settings: {
		// IMPORTANT: Keep this 'import/resolver' section commented out
		// to ensure AntFu's resolver settings take precedence.
		'import/resolver': {
		 typescript: {
		     alwaysTryTypes: true,
		     project: './tsconfig.json',
		 },
		 node: {
		     extensions: ['.js', '.jsx', '.ts', '.tsx'],
		 },
		},
		'boundaries/include': ['src/**/*'],
		'boundaries/elements': [
			{
				mode: 'full',
				type: 'tests',
				pattern: ['src/tests/**/*.+(ts|tsx|js|jsx)'],
			},
			{
				type: 'services',
				pattern: ['src/services/**/*'],
			},
			{
				type: 'ui',
				pattern: ['src/components/ui/**'],
			},
			{
				mode: 'full',
				type: 'feature',
				capture: ['featureName'],
				pattern: ['src/features/*/**/*'],
			},
			{
				mode: 'full',
				type: 'app',
				pattern: ['src/**/*'],
			},
			{
				mode: 'full',
				type: 'shared',
				pattern: [
					'src/components/*',
					'src/lib/*',
					'src/stores/**/*',
					'src/hooks/**/*',
					'src/routes/**/*',
					'src/integrations/**/*',
					'src/providers/**/*',
				],
			},
		],
	},
	rules: {
		...boundaries.configs.recommended.rules,
		'import/no-cycle': 'error',
		'boundaries/no-private': 0,
		'boundaries/no-unknown-files': ['error'],
		'boundaries/element-types': [
			2,
			{
				default: 'disallow',
				rules: [
					{
						from: 'shared', 
						allow: ['shared', 'ui', 'services'],
						message: 'Shared components can only import from shared, ui, or services.'
					},
					{
						from: 'ui',
						allow: ['ui', 'shared'],
						message: 'UI components can only import from shared or other UI components.'
					},
					{ 
						from: 'tests', 
						allow: ['tests', 'shared', 'feature'], 
						message: 'Tests can only import from tests, shared, or features.' },
					{
						from: 'feature',
						allow: ['shared', 'ui', 'services', ['feature', { featureName: '${from.featureName}' }]],
						message: 'Features can only import from shared, ui, services, or other features with the same feature name.'
					},
					{
						from: 'app',
						allow: ['app', 'shared', 'ui', 'feature', 'services'],
						message: 'App can only import from itself, shared, ui, feature, or services.'
					},
				],
			},
		],
	},
});
