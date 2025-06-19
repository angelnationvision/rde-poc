export default function decorate(block) {
  const newClasses = [
    'input-label',
    'input-sublabel',
    'search-icon-inside',
    'close-icon',
    'placeholder',
  ];

  const children = Array.from(block.children);

  // Assign new class names and wrap <p> in <div> for input-label and input-sublabel
  children.forEach((child, index) => {
    if (newClasses[index]) {
      child.classList.add(newClasses[index]);

      const para = child.querySelector('p');
      if (para) {
        // Wrap <p> in a <div> if not already wrapped
        const wrapper = document.createElement('div');
        para.replaceWith(wrapper);
        wrapper.appendChild(para);
      }

      if (newClasses[index] === 'input-label') {
        para?.classList.add('b-regular');
      }
      if (newClasses[index] === 'input-sublabel') {
        para?.classList.add('f-regular');
      }
    }
  });

  const inputLabelP = block.querySelector('.input-label p');
  const inputSublabelP = block.querySelector('.input-sublabel p');

  if (inputLabelP && !inputSublabelP) {
    inputLabelP.style.marginBottom = '1.5rem';
  }

  // Extract elements needed for the search box
  const searchIcon = block.querySelector('.search-icon-inside');
  const closeIcon = block.querySelector('.close-icon');
  const placeholder = block.querySelector('.placeholder');

  const placeholderText = placeholder?.textContent.trim() || '';

  // Wrap search-icon-inside, input, close-icon, and placeholder inside .search-box
  if (searchIcon && closeIcon && placeholder) {
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholderText;
    input.className = 'search-input';

    // Move original elements into the search-box
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(input);
    searchBox.appendChild(closeIcon);
    searchBox.appendChild(placeholder);

    // Append search-box to the block
    block.appendChild(searchBox);
  }
}
