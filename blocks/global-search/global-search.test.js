import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import globalsearch from './global-search.js';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

function createMockBlock() {
  const block = document.createElement('div');

  const classContent = ['Label Text', 'SubLabel Text', '', '', 'Search Placeholder'];

  classContent.forEach(text => {
    const div = document.createElement('div');
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      div.appendChild(p);
    }
    block.appendChild(div);
  });

  return block;
}

describe('globalsearch', () => {
  let block;

  beforeEach(() => {
    document.body.innerHTML = ''; // clear DOM
    block = createMockBlock();
  });

  it('should apply correct class names and wrap <p> elements', () => {
    globalsearch(block);
    const children = block.querySelectorAll(':scope > div');

    expect(children[0].classList.contains('input-label')).toBe(true);
    expect(children[1].classList.contains('input-sublabel')).toBe(true);

    const labelP = children[0].querySelector('p');
    const subLabelP = children[1].querySelector('p');

    expect(labelP.classList.contains('b-regular')).toBe(true);
    expect(subLabelP.classList.contains('f-regular')).toBe(true);
    expect(labelP.parentElement.tagName).toBe('DIV');
  });

  it('should apply margin if input-sublabel is missing', () => {
    block.children[1].innerHTML = ''; // remove sublabel content
    globalsearch(block);
    const labelP = block.querySelector('.input-label p');
    expect(labelP.style.marginBottom).toBe('1.5rem');
  });

  it('should create a search-box with input and move elements inside it', () => {
    globalsearch(block);
    const searchBox = block.querySelector('.search-box');
    expect(searchBox).toBeTruthy();

    const input = searchBox.querySelector('input.search-input');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search Placeholder');

    expect(searchBox.querySelector('.search-icon-inside')).toBeTruthy();
    expect(searchBox.querySelector('.close-icon')).toBeTruthy();
    expect(searchBox.querySelector('.placeholder')).toBeTruthy();
  });
});
