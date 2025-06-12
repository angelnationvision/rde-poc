import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import footer from './footer.js';

import { loadFragment } from '../fragment/fragment.js';

// Mocks
vi.mock('../../scripts/aem.js', () => ({
  getMetadata: vi.fn(() => '/footer'), // Simulate metadata returning a relative path
}));

vi.mock('../fragment/fragment.js', () => ({
  loadFragment: vi.fn(),
}));

let block;
let fragment;

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://example.com', // ✅ Fixes "Invalid URL" error
  });
  global.window = dom.window;
  global.document = dom.window.document;
});

beforeEach(() => {
  block = document.createElement('div');

  // Mock footer fragment
  fragment = document.createElement('div');
  const childDiv = document.createElement('div');
  childDiv.setAttribute('data-radio', 'americas best');

  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';
  const p = document.createElement('p');
  p.textContent = '© 2020–2023 Company Name';
  wrapper.appendChild(p);

  childDiv.appendChild(wrapper);
  fragment.appendChild(childDiv);

  loadFragment.mockResolvedValue(fragment);
});

describe('footer', () => {
  it('should load and footer footer correctly', async () => {
    await footer(block);

    const footerDiv = block.querySelector('div');
    expect(footerDiv).toBeTruthy();

    const text = footerDiv.querySelector('p').textContent;
    const currYear = new Date().getFullYear().toString();
    expect(text).toContain(`2020–${currYear}`);

    expect(block.classList.contains('footer-americas-bg')).toBe(true);
  });

  it('should apply correct background class for vistaOpt', async () => {
    fragment.firstElementChild.setAttribute('data-radio', 'vistaOpt');
    await footer(block);
    expect(block.classList.contains('footer-vistaopt-bg')).toBe(true);
  });

  it('should apply correct background class for eyeglass', async () => {
    fragment.firstElementChild.setAttribute('data-radio', 'eyeglass');
    await footer(block);
    expect(block.classList.contains('footer-eyeglass-bg')).toBe(true);
  });
});
