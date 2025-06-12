/* eslint-disable linebreak-style */
import { describe, it, expect, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import buttonNvi from './button-nvi.js';

let document;

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
  document = dom.window.document;
});

describe('decorate CTA block', () => {
  const createBlock = ({ aria = '', newTab = '', classText = '' } = {}) => {
    const block = document.createElement('div');

    // Button element
    const btn = document.createElement('div');
    const link = document.createElement('a');
    link.classList.add('button');
    btn.appendChild(link);

    const id = document.createElement('div');
    id.textContent = 'btn-id';

    const ariaLabel = document.createElement('div');
    ariaLabel.textContent = aria;

    const classes = document.createElement('div');
    classes.textContent = classText;

    const openInNewTab = document.createElement('div');
    openInNewTab.textContent = newTab;

    block.append(btn, id, ariaLabel, classes, openInNewTab);
    return { block, link };
  };

  it('sets aria-label on the button if provided', () => {
    const { block, link } = createBlock({ aria: 'Buy now' });
    buttonNvi(block);
    expect(link.ariaLabel).toBe('Buy now');
  });

  it('sets target="_blank" if openInNewTab is true', () => {
    const { block, link } = createBlock({ newTab: 'true' });
    buttonNvi(block);
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('adds americas class if classes text includes "americas"', () => {
    const { block } = createBlock({ classText: 'some-class americas theme' });
    buttonNvi(block);
    expect(block.classList.contains('americas')).toBe(true);
  });

  it('adds eyeglass class if classes text includes "eyeglass"', () => {
    const { block } = createBlock({ classText: 'eyeglass special' });
    buttonNvi(block);
    expect(block.classList.contains('eyeglass')).toBe(true);
  });

  it('adds discountcontacts class if classes text includes "discountcontacts"', () => {
    const { block } = createBlock({ classText: 'discountcontacts store' });
    buttonNvi(block);
    expect(block.classList.contains('discountcontacts')).toBe(true);
  });

  it('adds vistaopt class if classes text includes "vistaopt"', () => {
    const { block } = createBlock({ classText: 'vistaopt lens' });
    buttonNvi(block);
    expect(block.classList.contains('vistaopt')).toBe(true);
  });

  it('removes id, ariaLabel, classes, and openInNewTabBool from the block', () => {
    const { block } = createBlock({ aria: 'something', newTab: 'true', classText: 'eyeglass' });
    buttonNvi(block);
    const children = Array.from(block.children);
    // only button div should remain
    expect(children.length).toBe(1);
    expect(children[0].querySelector('a.button')).not.toBeNull();
  });
});
