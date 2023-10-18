import * as core from '@actions/core';
import * as github from '@actions/github';

import { getBaseBranchName, getHeadBranchName, getPullRequestEvent, getRules } from './input';

import type { WebhookPayload } from '@actions/github/lib/interfaces';

describe('input', () => {
  let payload: WebhookPayload = {};
  let inputs: Record<string, string | string[]> = {};

  beforeEach(() => {
    payload = {};
    github.context.payload = payload;

    inputs = {};
    jest.spyOn(core, 'getMultilineInput').mockImplementation(name => {
      const value = inputs[name];
      if (!value || !Array.isArray(value)) throw new Error(`Input required and not supplied: ${name}`);
      return value;
    });
  });

  describe('getPullRequestEvent', () => {
    it('Should return pull request event', () => {
      payload.pull_request = {
        number: 0,
      };

      const pullRequestEvent = getPullRequestEvent();

      expect(pullRequestEvent).toEqual({ number: 0 });
    });

    it('Should throw error - no pull request event', () => {
      expect(() => getPullRequestEvent()).toThrow('This action only works on pull_request event');
    });
  });

  describe('getBaseBranchName', () => {
    it('Should return base branch name', () => {
      payload.pull_request = {
        number: 0,
        base: {
          ref: 'main',
        },
      };

      const baseBranchName = getBaseBranchName();

      expect(baseBranchName).toEqual('main');
    });
    
    it('Should throw error - no base branch name', () => {
      payload.pull_request = {
        number: 0,
      };

      expect(() => getBaseBranchName()).toThrow('Failed to get base branch name');
    });
  });
  
  describe('getHeadBranchName', () => {
    it('Should return head branch name', () => {
      payload.pull_request = {
        number: 0,
        head: {
          ref: 'development',
        },
      };

      const headBranchName = getHeadBranchName();

      expect(headBranchName).toEqual('development');
    });
    
    it('Should throw error - no head branch name', () => {
      payload.pull_request = {
        number: 0,
      };

      expect(() => getHeadBranchName()).toThrow('Failed to get head branch name');
    });
  });

  describe('getRules', () => {
    it('Should return rules', () => {
      inputs['rules'] = ['main <- development', 'development <- feature/* chore/*'];

      const rules = getRules();

      expect(rules).toHaveLength(2);
      expect(rules[0]).toEqual({ base: 'main', heads: ['development'] });
      expect(rules[1]).toEqual({ base: 'development', heads: ['feature/*', 'chore/*'] });
    });

    it('Should throw error - invalid rule', () => {
      inputs['rules'] = ['main <- development', 'development'];

      expect(() => getRules()).toThrow('Invalid rule: development');
    });

    it('Should throw error - no rules', () => {
      expect(() => getRules()).toThrow('Input required and not supplied: rules');
    });
  });
});
