export default function decorate(block) {
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('hero-content-wrapper');

  let ctaContainer = null;
  let heroImage = null;
  let btnTargetValue = false;
  let noAlt = false;

  let firstCtaClass = '';
  let secondCtaClass = '';

  // First pass: extract needed values
  const children = [...block.children];
  if (children[9]) {
    firstCtaClass = children[9].textContent.trim();
  }
  if (children[11]) {
    secondCtaClass = children[11].textContent.trim();
  }

  // Second pass: decorate
  children.forEach((div, index) => {
    if ((index === 8 || index === 10) && div.querySelector('a.button')) {
      if (!ctaContainer) {
        ctaContainer = document.createElement('div');
        ctaContainer.classList.add('hero-cta-container');
      }

      div.classList.add('hero-cta');

      // Apply stored class names
      if (index === 8 && firstCtaClass) {
        div.classList.add(firstCtaClass);
      }
      if (index === 10 && secondCtaClass) {
        div.classList.add(secondCtaClass);
      }

      ctaContainer.appendChild(div);
    } else {
      if (index === 0 && div.querySelector('picture')) {
        div.className = 'hero-image';
        heroImage = div;
      } else if (index === 1 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-img-metadata';
      } else if (index === 2 && div.querySelector('div')) {
        const text = div.textContent.trim();
        div.className = text === '' ? '' : 'hero-img-no-alt';
        if (text.toLowerCase() === 'true') {
          noAlt = true;
        }
      } else if (index === 3 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-pretitle';
      } else if (index === 4 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-title';
      } else if (index === 5 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-subtitle';
      } else if (index === 6 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-body-text';
      } else if (index === 7 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-id';
      } else if (index === 12 && div.querySelector('div')) {
        div.className = div.textContent.trim() === '' ? '' : 'hero-btn-target';
        if (div.textContent.trim().toLowerCase() === 'true') {
          btnTargetValue = true;
        }
      } else {
        div.className = 'hero-body';
      }

      parentDiv.appendChild(div);
    }
  });

  if (ctaContainer) {
    parentDiv.appendChild(ctaContainer);
  }

  block.textContent = '';
  if (heroImage) {
    if (noAlt) {
      const img = heroImage.querySelector('img');
      if (img) {
        img.removeAttribute('alt');
      }
    }
    block.appendChild(heroImage);
  }
  block.appendChild(parentDiv);

  // Add target="_blank" to all hero-cta links if hero-btn-target is "true"
  if (btnTargetValue) {
    block.querySelectorAll('.hero-cta a').forEach(a => {
      a.setAttribute('target', '_blank');
    });
  }
}
