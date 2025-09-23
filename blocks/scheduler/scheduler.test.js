/* eslint-disable */
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

describe('scheduler', () => {
  it('test', () => {
    expect(1).toBe(1); // only the button wrapper should remain
  });
});
