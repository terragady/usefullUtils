// commitlint.config.ts
import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'include-jira-ticket': [1, 'always'],
  },
  plugins: [
    {
      rules: {
        'include-jira-ticket': ({ subject }) => {
          const jiraRegex = /\[([A-Z]+-[0-9]+)\]/;
          return [
            jiraRegex.test(subject ?? ''),
            'Your subject should contain jira ticket in square brackets e.g. feat: [BW-123] initial commit',
          ];
        },
      },
    },
  ],
};

module.exports = Configuration;
