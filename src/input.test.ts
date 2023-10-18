import * as core from '@actions/core';

import { getRules } from './input';

describe('input', () => {
  let inputs: Record<string, string | string[]> = {};

  beforeEach(() => {
    inputs = {};

    jest.spyOn(core, 'getMultilineInput').mockImplementation(name => {
      const value = inputs[name];
      if (!value || !Array.isArray(value)) throw new Error(`Input required and not supplied: ${name}`);
      return value;
    });
  });

  describe('getRules', () => {
    it('Should return rules', () => {
      inputs['rules'] = ['main development', 'development feature/* chore/*'];

      const rules = getRules();

      expect(rules).toHaveLength(2);
      expect(rules[0]).toEqual({ base: 'main', heads: ['development'] });
      expect(rules[1]).toEqual({ base: 'development', heads: ['feature/*', 'chore/*'] });
    });

    it('Should throw error - invalid rule', () => {
      inputs['rules'] = ['main development', 'development'];

      expect(() => getRules()).toThrow('Invalid rule: development');
    });

    it('Should throw error - no rules', () => {
      expect(() => getRules()).toThrow('Input required and not supplied: rules');
    });
  });
});
