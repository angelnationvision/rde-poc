import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import decoratesearch from './search.js';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

describe('decoratesearch', () => {
  let container;
  let hamburger;
  let searchBlock;

  beforeEach(() => {
    // Set up base DOM
    document.body.innerHTML = `
      <div class="nav-wrapper" style="height:64px"></div>
      <div class="navigation-wrapper"></div>
      <div class="nav-tools">
        <div class="default-content-wrapper"></div>
      </div>
      <div class="nav-brand"></div>
      <div class="navigation-container"></div>
      <div class="search-icon"></div>
      <div class="hamburger"></div>
    `;

    container = document.querySelector('.search-icon');
    hamburger = document.querySelector('.hamburger');

    // Simulate search block with 5 direct children
    searchBlock = document.createElement('div');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 8; i++) {
      const div = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = `Text ${i}`;
      div.appendChild(p);
      searchBlock.appendChild(div);
    }
    document.body.appendChild(searchBlock);
  });

  it('should initialize and update DOM correctly', async () => {
    await decoratesearch(container, hamburger, searchBlock);

    // Input label should exist
    expect(searchBlock.querySelector('.input-label')).toBeTruthy();

    // Input field should be created
    expect(searchBlock.querySelector('input[type="text"]')).toBeTruthy();

    // search-icon-inside class should be applied
    expect(searchBlock.querySelector('.search-icon-inside')).toBeTruthy();

    // Close icon should exist
    expect(searchBlock.querySelector('.close-icon')).toBeTruthy();

    // Placeholder should exist
    expect(searchBlock.querySelector('.placeholder')).toBeTruthy();

    // Search overlay should be created and hidden initially
    const overlay = document.querySelector('.search-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay.classList.contains('hidden')).toBe(true);
  });

  it('should toggle visibility on search icon click', async () => {
    await decoratesearch(container, hamburger, searchBlock);
    const navSections = document.querySelector('.navigation-container');

    container.click();
    expect(searchBlock.classList.contains('hidden')).toBe(true);
    expect(navSections.style.visibility).toBe('hidden');
  });

  it('should clear input on close icon click', async () => {
    await decoratesearch(container, hamburger, searchBlock);
    const input = searchBlock.querySelector('input');
    const closeIcon = searchBlock.querySelector('.close-icon');

    input.value = 'test';
    closeIcon.click();

    expect(input.value).toBe('');
  });
});
