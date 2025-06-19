/* eslint-disable */
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import decorate from './button-nvi.js';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

function createMockBlock({
  text = 'Click Me',
  ariaLabel = 'CTA Button',
  brandClass = 'americas',
  iconPlacement = 'leading',
  size = 'large',
  inverse = 'true',
  iconImage = true,
  openInNewTab = 'true',
} = {}) {
  const block = document.createElement('div');

  // Create CTA
  const ctaWrapper = document.createElement('div');
  const cta = document.createElement('a');
  cta.href = '#';
  cta.className = 'button';
  cta.textContent = text;
  ctaWrapper.appendChild(cta);
  block.appendChild(ctaWrapper);

  // Create metadata children
  const createDiv = content => {
    const div = document.createElement('div');
    div.textContent = content;
    return div;
  };

  const icon = document.createElement('div');
  if (iconImage) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = 'icon.svg';
    picture.appendChild(img);
    icon.appendChild(picture);
  }

  const children = [
    createDiv('button1'), // id (not used)
    createDiv(ariaLabel),
    createDiv(brandClass),
    createDiv(iconPlacement),
    createDiv(size),
    createDiv(inverse),
    icon,
    createDiv(openInNewTab),
  ];

  children.forEach(child => block.appendChild(child));

  return { block, cta };
}

describe('decorate', () => {
  let block, cta;

  beforeEach(() => {
    const result = createMockBlock();
    block = result.block;
    cta = block.querySelector('a.button');
    document.body.innerHTML = ''; // clear DOM
    document.body.appendChild(block);
  });

  it('adds a span wrapper to button text', () => {
    decorate(block);
    const span = cta.querySelector('span');
    expect(span).toBeTruthy();
    expect(span.textContent).toBe('Click Me');
  });

  it('sets aria-label attribute', () => {
    decorate(block);
    expect(cta.getAttribute('aria-label')).toBe('CTA Button');
  });

  it('adds brand class to block', () => {
    decorate(block);
    expect(block.classList.contains('americas')).toBe(true);
  });

  it('adds size class to block', () => {
    decorate(block);
    expect(block.classList.contains('large')).toBe(true);
  });

  it('applies inverse class and styles', () => {
    decorate(block);
    expect(block.classList.contains('iblack')).toBe(true);
    expect(document.body.style.backgroundColor).toBe('rgb(28, 24, 24)');
  });

  it('sets target="_blank" and rel on link if openInNewTab is true', () => {
    decorate(block);
    expect(cta.getAttribute('target')).toBe('_blank');
    expect(cta.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('places icon before text if placement is leading', () => {
    decorate(block);
    const picture = cta.querySelector('picture');
    expect(picture).toBeTruthy();
    expect(picture.nextSibling.tagName.toLowerCase()).toBe('span');
  });

  it('removes metadata children from the block after decoration', () => {
    decorate(block);
    expect(block.children.length).toBe(1); // only the button wrapper should remain
  });
});
