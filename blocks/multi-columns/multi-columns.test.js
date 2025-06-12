import { describe, it, expect, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import multicolumn from './multi-columns.js'; // Update with the actual path

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

describe('multicolumn function', () => {
  it('adds the multi-columns class to the block', () => {
    const block = document.createElement('div');
    multicolumn(block);
    expect(block.classList.contains('multi-columns')).toBe(true);
  });

  it('adds multi-column-title class to the first column', () => {
    const block = document.createElement('div');
    const title = document.createElement('div');
    const content = document.createElement('div');
    block.append(title, content);
    multicolumn(block);
    expect(title.classList.contains('multi-column-title')).toBe(true);
  });

  it('wraps content columns in a div and adds the multi-column-content class', () => {
    const block = document.createElement('div');
    const title = document.createElement('div');
    const content = document.createElement('div');
    block.append(title, content);

    const contentChildren = Array.from({ length: 4 }, () => document.createElement('div'));
    content.append(...contentChildren);

    multicolumn(block);

    const contentWrapper = block.querySelector('.multi-column-content-wrapper');
    expect(contentWrapper).not.toBeNull();
    expect(content.classList.contains('multi-column-content')).toBe(true);
  });

  it('adds the content-link-image class to the fourth child and moves it to the content wrapper', () => {
    const block = document.createElement('div');
    const title = document.createElement('div');
    const content = document.createElement('div');
    block.append(title, content);

    // Create 4 children, and the 4th will become the link image
    const contentChildren = Array.from({ length: 4 }, () => document.createElement('div'));
    content.append(...contentChildren);

    multicolumn(block);

    // Check if the fourth child has the "content-link-image" class
    const linkImage = contentChildren[3];
    expect(linkImage.classList.contains('content-link-image')).toBe(true);

    // Check if the link image was moved to the wrapper
    const contentWrapper = block.querySelector('.multi-column-content-wrapper');
    expect(contentWrapper.contains(linkImage)).toBe(true);
  });
});
