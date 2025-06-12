import { describe, it, beforeAll, expect, beforeEach } from 'vitest';
import breadcrumb from './breadcrumb.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});
// Utility function to create a mock DOM element
function createMockBlock() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('block'); // <-- this is key

  const block = document.createElement('div');

  const createDivWithContent = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  };

  const logo = createDivWithContent('<picture><img src="logo.png"></picture>');
  logo.classList.add('logo');

  const pageText = createDivWithContent('<p>Page Title</p>');
  const logoUrl = createDivWithContent('<a href="/home"></a>');
  const rightArrow = createDivWithContent('<picture><img src="arrow.png"></picture>');
  const startLevel = createDivWithContent('<p>1</p>');

  const item1 = createDivWithContent(`
    <div><p>Section 1</p></div>
    <div></div>
    <div><p>false</p></div>
    <a href="/section1">Section 1</a>
  `);
  const item2 = createDivWithContent(`
    <div><p>Section 2</p></div>
    <div></div>
    <div><p>false</p></div>
    <a href="/section2">Section 2</a>
  `);

  block.append(logo, pageText, logoUrl, rightArrow, startLevel, item1, item2);
  wrapper.appendChild(block);

  return { wrapper, block };
}

let wrapper, block;

beforeEach(() => {
  document.body.innerHTML = '';
  const result = createMockBlock();
  wrapper = result.wrapper;
  block = result.block;
  document.body.appendChild(wrapper);
});

it('should decorate the block with breadcrumb nav', async () => {
  await breadcrumb(block);

  const breadcrumbs = block.querySelector('.breadcrumb-nav');
  expect(breadcrumbs).toBeTruthy();

  const links = breadcrumbs.querySelectorAll('a');
  expect(links.length).toBe(3);

  expect(links[0].href).toContain('/home');
  expect(links[1].textContent).toBe('Section 1');
  expect(links[2].textContent).toBe('Section 2');
  expect(links[2].classList.contains('active')).toBe(true);
});
