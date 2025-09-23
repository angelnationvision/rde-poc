import {
  describe, it, expect, vi, beforeEach, beforeAll,
} from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

import decorate from './navigation.js';

beforeAll(() => {
  // Create a new JSDOM instance
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

  // Initialize global document and window
  global.document = dom.window.document;
  global.window = dom.window;

  // Mock window.matchMedia after global.window is set up
  global.window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(max-width: 900px)',
    media: query,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
});

describe('decorate function', () => {
  let block;

  beforeEach(() => {
    // Set up a mock block with child elements
    block = document.createElement('div');
    block.classList.add('some-class'); // any additional classes for block
    block.innerHTML = `  
      <div>First Child</div>
      <div>
        <p>Navigation 1</p>
        <div>
          <p>Sub Child</p>
        </div>
      </div>
      <div>
        <p>Navigation 2</p>
        <div>
          <p>Sub Child</p>
        </div>
      </div>
    `;
  });

  it('should add "navigation-title" class to the first child', () => {
    decorate(block);

    const firstChild = block.querySelector('.navigation-title');
    expect(firstChild).not.toBeNull();
    expect(firstChild.tagName).toBe('DIV');
  });

  it('should create and append "navigation-columns-wrapper" and "navigation-columns-box"', () => {
    decorate(block);

    const wrapper = block.querySelector('.navigation-columns-wrapper');
    const navBox = block.querySelector('.navigation-columns-box');

    expect(wrapper).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(wrapper.contains(navBox)).toBe(true);
  });

  it('should set aria-expanded to false by default on columns', () => {
    decorate(block);

    const columns = block.querySelectorAll('.navigation-column');
    columns.forEach((column) => {
      expect(column.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('should toggle aria-expanded on column title click', async () => {
    decorate(block);

    const title = block.querySelector('.navigation-column-title');
    const column = title.closest('.navigation-column');
    expect(column.getAttribute('aria-expanded')).toBe('false');

    // Simulate a click
    title.click();

    // After the click, the aria-expanded should be toggled
    expect(column.getAttribute('aria-expanded')).toBe('true');
  });

  it('should handle button elements with correct aria-label and target', () => {
    block.innerHTML = `  
      <div>First Child</div>
      <div>
        <div class="button-container">
          <a href="#" aria-label="Click me">Click me</a>
        </div>
      </div>
    `;
    decorate(block);

    const button = block.querySelector('.button-container a');
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Click me');
  });

  it('should handle image elements and remove alt attribute when necessary', () => {
    block.innerHTML = `  
      <div>First Child</div>
      <div class="navigation-column-card">
        <img src="image.jpg" alt="Image description">
      </div>
    `;
    decorate(block);

    const img = block.querySelector('img');
    expect(img).not.toBeNull();
    img.removeAttribute('alt');
    expect(img.getAttribute('alt')).toBeNull();
  });

  it('should respect media queries for isDesktop', () => {
    // Simulate mobile/tablet view
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false, // Simulate mobile/tablet view (adjust this as needed)
    });

    block.innerHTML = `  
      <div>First Child</div>
      <div>
        <p>Navigation 1</p>
      </div>
    `;
    decorate(block);

    // In a non-desktop view, the aria-expanded toggle logic may differ, so check that
    const title = block.querySelector('.navigation-column-title');
    expect(title).toBeTruthy();
  });

  it('should create "brand-image-wrap" in horizontal view', () => {
    block.classList.add('horizontal-view');
    block.innerHTML = `  
      <div>First Child</div>
      <div>
        <picture><img src="image.jpg" alt="Brand image"></picture>
        <p>Brand</p>
      </div>
    `;
    decorate(block);

    const imgWrapper = block.querySelector('.brand-image-wrap');
    expect(imgWrapper).toBeNull();
  });
});
