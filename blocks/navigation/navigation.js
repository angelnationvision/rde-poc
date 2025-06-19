/* eslint-disable no-shadow */
function toggleAllNavColumns(columns, expanded = false) {
  columns.querySelectorAll('.navigation-column').forEach(column => {
    column.setAttribute('aria-expanded', expanded);
    column.querySelector('.navigation-column-child').style.maxHeight = '0';
  });
}

export default function decorate(block) {
  const children = Array.from(block.children);
  let noAlt = false;
  const isHorizontalView = block.classList.contains('horizontal-view');

  // media query match that indicates mobile/tablet width
  const isDesktop = window.matchMedia('(min-width: 900px)');

  if (children.length > 0) {
    // Add a different class to the first child
    children[0].classList.add('navigation-title');
  }
  // Create a wrapper for all remaining columns
  const wrapper = document.createElement('div');
  wrapper.classList.add('navigation-columns-wrapper');
  let verticalStack;
  const navBox = document.createElement('div');
  navBox.classList.add('navigation-columns-box');
  if (isHorizontalView) {
    verticalStack = document.createElement('div');
    verticalStack.classList.add('navigation-vertical-stack');
    navBox.appendChild(verticalStack);
  }
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('navigation-button-wrapper'); // Add the class for the wrapper
  let columnCount = 0;
  children.slice(1).forEach(div => {
    div.classList.add('navigation-column');

    const pictures = div.querySelectorAll('picture');
    const hasPicture = pictures.length > 0;
    // eslint-disable-next-line eqeqeq
    if (pictures.length == 1) {
      div.className = 'navigation-column-card';
    }

    const isButton = div.querySelector('.button-container');
    if (isButton && !hasPicture) {
      div.className = 'navigation-column-button';
      // eslint-disable-next-line prettier/prettier
      const [, id, ariaLabel, brand, btnType, IconPlacement, size, inverse, icon, openInNewTab] = [...div.children];
      id?.remove();
      brand?.remove();
      const buttonType = btnType?.textContent?.trim().split(',')[1] || '';
      if (buttonType) {
        div.className = buttonType.trim();
      }
      btnType?.remove();
      if (openInNewTab?.textContent.trim() === 'true') {
        div.querySelector('a')?.setAttribute('target', '_blank');
      }
      IconPlacement?.remove();
      size?.remove();
      inverse?.remove();
      icon?.remove();
      openInNewTab?.remove();
      if (ariaLabel?.textContent) {
        div.querySelector('a')?.setAttribute('aria-label', ariaLabel.textContent.trim());
      }
      ariaLabel?.remove();
    }
    if (!hasPicture && !isButton) {
      const subChildren = Array.from(div.children);
      subChildren.forEach((subDiv, index) => {
        if (index === 0) {
          subDiv.classList.add('navigation-column-title');
          if (!isHorizontalView) {
            subDiv.closest('.navigation-column').setAttribute('aria-expanded', 'false');
          }
          subDiv.addEventListener('click', event => {
            event.stopPropagation();
            const columnChild = subDiv
              .closest('.navigation-column')
              .querySelector('.navigation-column-child');
            if (!isDesktop.matches) {
              if (!isHorizontalView) {
                const expanded =
                  subDiv.closest('.navigation-column').getAttribute('aria-expanded') === 'true';
                toggleAllNavColumns(block);
                subDiv
                  .closest('.navigation-column')
                  .setAttribute('aria-expanded', expanded ? 'false' : 'true');
                if (expanded) {
                  columnChild.style.maxHeight = '0'; // Collapse
                } else {
                  columnChild.style.maxHeight = `${columnChild.scrollHeight}px`; // Expand based on content height
                }
              }
            }
          });
        } else {
          subDiv.classList.add('navigation-column-child');
          const navList = subDiv.querySelectorAll('li');
          navList.forEach(list => {
            const icon = list.querySelector('.icon') || '';
            const sublist = list.querySelector('ul') || '';
            if (icon) {
              list.querySelector('a')?.appendChild(icon);
              list.classList.add('nav-col-icon');
            }
            if (sublist) {
              list.querySelector('a')?.appendChild(sublist);
            }
          });
        }
      });
    } else if (hasPicture && pictures.length === 1) {
      const cardWrapper = div; // since div is already the 'navigation-column-card'
      const cardElements = Array.from(cardWrapper.children);
      const cardChildrens = [...cardElements];
      const cardButtons = document.createElement('div');
      cardButtons.classList.add('card-btn-box');
      let ctaType = '';
      let ctaType1 = '';
      if (cardChildrens[5]) {
        ctaType = cardChildrens[5].textContent.trim();
        cardChildrens[5].textContent = '';
      }
      if (cardChildrens[7]) {
        ctaType1 = cardChildrens[7].textContent.trim();
        cardChildrens[7].textContent = '';
      }
      cardElements.forEach((child, index) => {
        const text = child.textContent.trim();
        if (index === 0 && child.querySelector('picture')) {
          child.className = 'navigation-card-image';
        } else if (index === 1 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-img-no-alt';
          if (text.toLowerCase() === 'true') {
            noAlt = true;
          }
        } else if (index === 2 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-card-pretitle';
        } else if (index === 3 && child.querySelector('p')) {
          child.className = text === '' ? '' : 'navigation-card-title';
        } else if (index === 4 && child.querySelector('p')) {
          child.className = `${ctaType} nav-card-btn`;
          cardButtons.appendChild(child);
        } else if (index === 6 && child.querySelector('p')) {
          child.className = `${ctaType1} nav-card-btn`;
          cardButtons.appendChild(child);
        } else if (index === 8) {
          child.className = 'navigation-btn-tab';
          if (child.querySelector('p')?.textContent.trim() === 'true') {
            const btns = cardButtons.querySelectorAll('.button-container a');
            // eslint-disable-next-line no-unused-vars
            btns.forEach((btn, index) => {
              btn?.setAttribute('target', '_blank');
            });
          }
        }
      });
      if (noAlt) {
        if (cardWrapper.querySelector('img')) {
          cardWrapper.querySelector('img').removeAttribute('alt');
        }
      }
      cardWrapper.appendChild(cardButtons);
    } else if (hasPicture && pictures.length > 1 && isHorizontalView) {
      // === Horizontal brand layout ===
      div.className = 'navigation-column-card';
      const subChildren = Array.from(div.children);
      const imgwrapper = document.createElement('div');
      imgwrapper.classList.add('brand-image-wrap');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < subChildren.length; i++) {
        const child = subChildren[i];

        if (i === 0) {
          // child.className = 'brand-title';
          child.classList.add('brand-title', 's-medium');
        } else if (child.querySelector('picture')) {
          child.className = 'brand-image';
          imgwrapper.appendChild(child);

          // === Assign button href to img as data-link ===
          const next = subChildren[i + 1];
          const anchor = next?.querySelector('.button-container a');
          const href = anchor?.getAttribute('href');
          if (href) {
            const img = child.querySelector('img');
            if (img) {
              const link = document.createElement('a');
              link.href = href;
              img.parentNode.insertBefore(link, img);
              link.appendChild(img);
            }
          }
          if (next && next.querySelector('.button-container')) {
            next.classList.add('brand-button-wrapper');
          }
        } else if (child.textContent.trim() === '') {
          child.remove();
        }
      }
      subChildren.forEach(child => {
        if (child.querySelector('.button-container')) {
          child.classList.add('brand-button-wrapper');
        }
      });
      div.appendChild(imgwrapper);
    }
    if (!isButton || hasPicture) {
      if (isHorizontalView && columnCount < 2 && verticalStack) {
        verticalStack.appendChild(div);
      } else {
        navBox.appendChild(div);
      }
      columnCount += 1;
    } else {
      buttonWrapper.appendChild(div);
    }
  });

  // === Remove empty .brand-image divs ===
  block.querySelectorAll('.brand-image').forEach(div => {
    if (div.innerHTML.trim() === '') {
      div.remove();
    }
  });

  wrapper.appendChild(navBox);

  navBox.appendChild(buttonWrapper);

  // Append the wrapper after the first child
  if (children.length > 1) {
    block.appendChild(wrapper);
  }
}
