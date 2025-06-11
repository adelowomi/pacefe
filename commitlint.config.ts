import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: {
		name: "conventional-changelog-atom",
		parserOpts: {
			issuePrefixes: ["EF-"]
		}
	},
	formatter: "@commitlint/format",
	rules: {
		"type-enum": [RuleConfigSeverity.Error, "always", ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
		'references-empty': [RuleConfigSeverity.Error, 'never'],
		'subject-case': [RuleConfigSeverity.Error, 'always', ['sentence-case', 'start-case', 'upper-case']],
		'subject-empty': [RuleConfigSeverity.Error, 'never'],
	},
};

export default Configuration;