export default function decorate(block) {
const cols = [...block.firstElementChild.children];
const attr = document.querySelector('[class*="gap-"]');
const gapName = attr.className.split(" ");
const gapClass = gapName[1];

// setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.parentElement.classList.add('grid-container', gapClass);
      col.parentElement.setAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }  

      //Created colnode prefix in case others use the grid classname within their blocks
            const colnode = "colnode-";
            const all_elements_array = Array.from(col.querySelectorAll('*'));           
            if (col.innerHTML.includes(colnode)) {
              const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
              const getElement = matching_elements.at(-1);
              const eleString = getElement.textContent.trim().replace('colnode-', '');
              col.classList.add(eleString);
              const remove = getElement.remove();
            }

      //Created colgrid prefix for all other classes
            const colgrid = "colgrid-";
            const all_elements_arraycg = Array.from(col.querySelectorAll('*'));           
           if (col.innerHTML.includes(colgrid)) {
              const matching_elements_cg = all_elements_arraycg.filter(element => element.innerHTML.includes(colgrid));
              const getElementcg = matching_elements_cg.at(-1);
              const eleStringcg = getElementcg.textContent.trim();
              col.classList.add(eleStringcg);
              const removecg = getElementcg.remove();
            }
    
    });
  });

  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
