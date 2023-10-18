import * as core from '@actions/core';

import type { Rule } from './type';

export const getRules = (): Rule[] => {
  const input = core.getMultilineInput('rules');

  return input.map((line) => {
    const [base, ...heads] = line.split(' ');

    if (!base || heads.length <= 0) {
      throw new Error(`Invalid rule: ${line}`);
    }

    return { base, heads };
  });
};
