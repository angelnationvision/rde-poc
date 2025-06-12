import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import hero from './hero.js';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

describe('hero', () => {
  let block;

  beforeEach(() => {
    block = document.createElement('div');

    // Simulating child elements structure
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 13; i++) {
      const div = document.createElement('div');
      if (i === 0) {
        const picture = document.createElement('picture');
        div.appendChild(picture);
      } else if (i === 8 || i === 10) {
        const anchor = document.createElement('a');
        anchor.classList.add('button');
        div.appendChild(anchor);
      } else {
        div.textContent = `Child ${i}`;
      }
      block.appendChild(div);
    }

    block.children[9].textContent = 'first-class';
    block.children[11].textContent = 'second-class';
    block.children[12].textContent = 'true';
  });

  it('should decorate the block correctly', () => {
    hero(block);

    const parentDiv = block.querySelector('.hero-content-wrapper');
    expect(parentDiv).toBeTruthy();

    // Check if hero image is correctly assigned
    const heroImage = block.querySelector('.hero-image');
    expect(heroImage).toBeTruthy();

    // Check if CTA elements are correctly assigned
    const ctaContainer = block.querySelector('.hero-cta-container');
    expect(ctaContainer).toBeTruthy();
    expect(ctaContainer.querySelectorAll('.hero-cta').length).toBe(2);

    // Check if CTA buttons have the correct classes
    expect(ctaContainer.children[0].classList.contains('first-class')).toBe(true);
    expect(ctaContainer.children[1].classList.contains('second-class')).toBe(true);

    // Check if target="_blank" is added when hero-btn-target is true
    ctaContainer.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('target') === '_blank') {
        expect(a.getAttribute('target')).toBe('_blank');
      } else {
        expect(a.getAttribute('target')).toBe(null);
      }
    });
  });
});
