// const toggleAccordion = details => {
//   const isAlreadyOpen = details.hasAttribute('open');

//   const parentElem = details.closest('.accordion-container');
//   if (parentElem) {
//     const detailsArr = parentElem.querySelectorAll('details');
//     detailsArr.forEach(item => item.removeAttribute('open'));
//   }

//   // Only re-open if it was previously closed
//   if (!isAlreadyOpen) {
//     details.setAttribute('open', '');
//   }
// };

export default async function decorate(block) {
  const panels = [...block.children];

  // extract collapse class from panels
  const [classPanel, ...restPanels] = panels;
  const [classes] = [...classPanel.children];
  const collapse = classes?.textContent.trim() !== 'false';
  block.removeChild(classPanel);

  [...restPanels].forEach((panel, i) => {
    const [accordionLabel, copyText] = [...panel.children];
    panel.classList.add('accordion-panel');
    panel.setAttribute('tabindex', '0');
    const summary = document.createElement('summary');
    if (accordionLabel) {
      summary.className = 'accordion-item-label';
      summary.append(accordionLabel);
    }
    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (copyText?.textContent.trim() !== '') {
      body.append(copyText);
    }

    const details = document.createElement('details');
    details.className = 'accordion-item';
    // details.addEventListener('click', e => {
    //   e.preventDefault();
    //   toggleAccordion(details, e);
    // });

    if (i === 0 && collapse) {
      details.setAttribute('open', '');
    }
    panel.textContent = '';
    details.append(summary, body);
    panel.append(details);
  });
}
