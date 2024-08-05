import * as core from '@actions/core';
import * as github from '@actions/github';

import type { Rule } from './type';
import type { WebhookPayload } from '@actions/github/lib/interfaces';

export const getPullRequestEvent = (): Exclude<WebhookPayload['pull_request'], undefined> => {
  if (!github.context.payload.pull_request) {
    throw new Error('This action only works on pull_request event');
  }
  return github.context.payload.pull_request;
};

export const getBaseBranchName = (): string => {
  const { base = {} } = getPullRequestEvent();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const ref = base.ref;

  if (typeof ref === 'string') {
    return ref;
  }

  throw new Error('Failed to get base branch name');
};

export const getHeadBranchName = (): string => {
  const { head = {} } = getPullRequestEvent();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const ref = head.ref;

  if (typeof ref === 'string') {
    return ref;
  }

  throw new Error('Failed to get head branch name');
};

export const getRules = (): Rule[] => {
  const input = core.getMultilineInput('rules');

  return input.map((line) => {
    const [first, others] = line.split('<-');
    const base = first?.trim() ?? '';
    const heads = others?.trim()?.split(' ') ?? [];

    if (base.length <= 0 || heads.length <= 0) {
      throw new Error(`Invalid rule: ${line}`);
    }

    return { base, heads };
  });
};
