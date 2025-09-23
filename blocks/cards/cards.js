import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  let card = 0;
  const ul = document.createElement('ul');

  [...block.children].forEach(row => {
    const li = document.createElement('li');
    card += 1;
    li.classList.add(`cards-card-${card}`);
    moveInstrumentation(row, li);

    let btnTargetValue = false;
    let firstCtaClass = '';
    let secondCtaClass = '';

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    [...li.children].forEach((div, index) => {
      const text = div.textContent.trim();

      if (index === 0 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (index === 1 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-img-aspect-ratio';

        // Extract and apply aspect-ratio class to block
        const match = text.match(/aspect-ratio-[\w-]+/);
        if (match) {
          li.classList.add(match[0]);
        }
      } else if (index === 2 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-img-metadata';
      } else if (index === 3 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-img-no-alt';
      } else if (index === 4 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-card-pretitle';
      } else if (index === 5 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-card-title';
      } else if (index === 6 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-card-subtitle';
      } else if (index === 7 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-card-body-text';
      } else if (index === 8 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-id';
      } else if (index === 10) {
        div.className = 'cards-card-body';
        firstCtaClass = text;
      } else if (index === 12) {
        div.className = 'cards-card-body';
        secondCtaClass = text;
      } else if (index === 13 && div.querySelector('p')) {
        div.className = text === '' ? '' : 'cards-btn-target';
        if (text.toLowerCase() === 'true') {
          btnTargetValue = true;
        }
      } else {
        div.className = 'cards-card-body';
      }
    });

    // CTA Handling
    const newButtonContainer = document.createElement('div');
    newButtonContainer.classList.add('cards-card-buttoncontainer');

    let ctaIndex = 0;
    [...li.children].forEach(div => {
      const buttons = div.querySelectorAll('.button-container');
      buttons.forEach(btnContainer => {
        const wrapper = document.createElement('div');
        wrapper.className = 'cards-cta';

        // Apply stored class names to first and second CTA buttons
        if (ctaIndex === 0 && firstCtaClass) {
          wrapper.classList.add(firstCtaClass);
        } else if (ctaIndex === 1 && secondCtaClass) {
          wrapper.classList.add(secondCtaClass);
        }

        wrapper.appendChild(btnContainer);
        newButtonContainer.appendChild(wrapper);
        ctaIndex += 1;
      });
    });

    li.appendChild(newButtonContainer);

    // If btnTargetValue is true, add target="_blank" to links
    if (btnTargetValue) {
      newButtonContainer.querySelectorAll('a').forEach(a => {
        a.setAttribute('target', '_blank');
      });
    }

    ul.appendChild(li);
  });

  ul.querySelectorAll('picture > img').forEach(img => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
