export default function decorate(block) {
  // Add a wrapper class to the block
  block.classList.add('multi-columns');

  // Separate the title and content sections
  const columns = Array.from(block.children);
  if (columns.length > 1) {
    // The first column is the title
    const titleColumn = columns.shift();
    titleColumn.classList.add('multi-column-title');

    // Create a parent div for content columns
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('multi-column-content-wrapper');

    columns.forEach(contentColumn => {
      const children = Array.from(contentColumn.children);
      if (children.length === 4) {
        contentColumn.classList.add('multi-column-content');
        children[0].classList.add('content-image');
        children[1].classList.add('content-title');
        children[2].classList.add('content-description');
        children[3].classList.add('content-link-image');

        const linkImage = children[3];
        contentColumn.removeChild(linkImage);
        contentWrapper.append(contentColumn, linkImage);
      }
    });

    // Append the contentWrapper to the block
    block.appendChild(contentWrapper);
  }
}
