import * as core from '@actions/core';

import { main } from './main';

describe('main', () => {
  beforeEach(() => {
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
  });

  it('Should pass - simple rule', () => {
    const base = 'main';
    const head = 'development';
    const rules = [{ base: 'main', heads: ['development'] }];

    main({ base, head, rules });

    expect(core.warning).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  describe('Should pass - glob pattern rule', () => {
    it('Should pass - head', () => {
      const base = 'main';
      const head = 'feature/1';
      const rules = [{ base: 'main', heads: ['feature/*'] }];

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - base', () => {
      const base = 'feature/1';
      const head = 'feature/1/1';
      const rules = [{ base: 'feature/*', heads: ['feature/*/*'] }];

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  describe('Should pass - complex rules', () => {
    const rules = [
      { base: 'main', heads: ['development', 'feature/*', 'chore/*'] },
      { base: 'feature/*', heads: ['feature/*/*'] },
    ];

    it('Should pass - development', () => {
      const base = 'main';
      const head = 'development';

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - feature', () => {
      const base = 'main';
      const head = 'feature/*';

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - chore', () => {
      const base = 'main';
      const head = 'chore/*';

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - feature nested', () => {
      const base = 'feature/1';
      const head = 'feature/1/1';

      main({ base, head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  it('Should warn - no rule', () => {
    const base = 'staging';
    const head = 'development';
    const rules = [{ base: 'main', heads: ['development'] }];

    main({ base, head, rules });

    expect(core.warning).toHaveBeenCalledTimes(1);
    expect(core.warning).toHaveBeenCalledWith(`No rule found for base branch: ${base}`);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('Should fail - no match', () => {
    const base = 'main';
    const head = 'invalid';
    const rules = [{ base: 'main', heads: ['feature/*'] }];

    main({ base, head, rules });

    expect(core.warning).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenCalledWith(`The branch name does not follow the rules. The allowed branch name rules are as follows: ${rules[0]!.heads.join(', ')}`);
  });
});
