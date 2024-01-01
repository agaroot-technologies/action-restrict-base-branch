import * as core from '@actions/core';
import { minimatch } from 'minimatch';

import type { Rule } from './type';

export type MainOptions = {
  base: string;
  head: string;
  rules: Rule[];
};

export const main = ({
  base,
  head,
  rules,
}: MainOptions) => {
  const rule = rules.find(rule => minimatch(base, rule.base));
  if (!rule) {
    core.setFailed(`No rule found for base branch: ${base}`);
    return;
  }

  const match = rule.heads.some(pattern => minimatch(head, pattern));
  if (!match) {
    core.setFailed(`The branch name does not follow the rules. The allowed branch name rules are as follows: ${rule.heads.join(', ')}`);
  }
};
