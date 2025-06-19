/* eslint-disable */

export default function decorate(block) {
  const buttonChildren = [...block.children];
  const [btn, id, ariaLabel, classes, IconPlacement, size, inverse, icon, openInNewTabBool] =
    buttonChildren;

  const cta = block?.querySelector('a.button');

  if (!cta) return;

  // Wrap button text in a <span> to allow icon placement
  if (!cta.querySelector('span')) {
    const text = cta.textContent.trim();
    cta.textContent = '';
    const span = document.createElement('span');
    span.textContent = text;
    cta.appendChild(span);
  }

  // Apply aria-label
  if (ariaLabel?.textContent) {
    cta.setAttribute('aria-label', ariaLabel.textContent.trim());
  }

  // Open in new tab
  if (openInNewTabBool?.textContent.trim().toLowerCase() === 'true') {
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener noreferrer');
  }

  // Apply brand classes
  const brandClass = classes?.textContent.trim();
  if (brandClass?.includes('americas')) {
    block.classList.add('americas');
  } else if (brandClass?.includes('eyeglass')) {
    block.classList.add('eyeglass');
  } else if (brandClass?.includes('discountcontacts')) {
    block.classList.add('discountcontacts');
  } else if (brandClass?.includes('vistaopt')) {
    block.classList.add('vistaopt');
  }

  // Apply size class
  const sizes = size?.textContent.trim();
  if (['large', 'small'].includes(sizes)) {
    block.classList.add(sizes);
  }

  // Apply inverse style
  if (inverse?.textContent.trim().toLowerCase() === 'true') {
    block.classList.add('iblack');
    document.body.style.backgroundColor = '#1c1818';
  } else {
    block.classList.remove('iblack');
  }

  // Handle icon placement

  const iconPlacementRaw = IconPlacement?.textContent || '';
  const iconPlacement = iconPlacementRaw.trim().toLowerCase();
  if (['leading', 'trailing'].includes(iconPlacement)) {
    block.classList.add(iconPlacement);
  }

  const iconPicture = icon?.querySelector('picture');

  if (iconPicture) {
    const clonedIcon = iconPicture.cloneNode(true);
    if (iconPlacement === 'leading') {
      cta.insertBefore(clonedIcon, cta.firstChild);
    } else if (iconPlacement === 'trailing') {
      cta.appendChild(clonedIcon);
    }
  }

  // leading
  // trailing
  // Clean up block children
  [id, ariaLabel, classes, IconPlacement, size, inverse, icon, openInNewTabBool].forEach(el => {
    if (el) block.removeChild(el);
  });
}
