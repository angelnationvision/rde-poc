export default function decorate(block) {
  const children = Array.from(block.children);
  if (children.length > 0) {
    // Add a different class to the first child
    children[0].classList.add('navigation-title');
  }
  // Create a wrapper for all remaining columns
  const wrapper = document.createElement('div');
  wrapper.classList.add('navigation-columns-wrapper');
  children.slice(1).forEach(div => {
    div.classList.add('navigation-column');

    const hasPicture = div.querySelector('picture');
    if (hasPicture) {
      div.className = 'navigation-column-card';
    }

    const subChildren = Array.from(div.children);

    if (!hasPicture) {
      subChildren.forEach((subDiv, index) => {
        if (index === 0) {
          subDiv.classList.add('navigation-column-title');
        } else {
          subDiv.classList.add('navigation-column-child');
        }
      });
    } else {
      const cardWrapper = div; // since div is already the 'navigation-column-card'
      const cardElements = Array.from(cardWrapper.children);

      cardElements.forEach((child, index) => {
        const text = child.textContent.trim();

        if (index === 0 && child.querySelector('picture')) {
          child.className = 'navigation-card-image';
        } else if (index === 1 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-img-no-alt';
        } else if (index === 2 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-card-pretitle';
        } else if (index === 3 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-card-title';
        } else if (index === 4 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'text-btn';
        } else if (index === 5 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-button-text';
        }
      });
    }
    wrapper.appendChild(div); // Make sure 'wrapper' is defined somewhere outside this snippet
  });

  // Append the wrapper after the first child
  if (children.length > 1) {
    block.appendChild(wrapper);
  }
}
