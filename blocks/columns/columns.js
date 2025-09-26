export default function decorate(block) {
const cols = [...block.firstElementChild.children];

  // setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      console.log(col.className);
      const attr = document.querySelector('[class*="gap-"]');
      console.log(attr.className);




      col.parentElement.classList.add('grid-container');
      col.classList.add('colspan-default'); 
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  block.classList.add('columns-main columns');
}
