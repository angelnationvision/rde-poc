export default function decorate(block) {
const cols = [...block.firstElementChild.children];
const attr = document.querySelector('[class*="gap-"]');
const gapName = attr.className.split(" ");
const gapClass = gapName[1];

// setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.parentElement.classList.add('grid-container', gapClass);

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      //Created colnode prefix in case others use the classname within their blocks 
     const colnode = "colnode-";
       const all_elements_array = Array.from(document.querySelectorAll('*'));
        const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
        const getElement = matching_elements.at(-1);
        const eleString = getElement.textContent.trim().replace('colnode-', '');
        console.log(eleString);
        col.classList.add(eleString);
        //const remove = getElement.remove();

        if (eleString == null) {
          col.parentElement.setAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
        }
    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
