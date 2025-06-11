/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
/* eslint-env node */

// const formatCommand = 'prettier --write';
const lintCommand = 'npm run lint:fix';
const testCommand = 'npm run test';

export default {
	'*.{js,jsx,ts,tsx,html,css}': [lintCommand],
}