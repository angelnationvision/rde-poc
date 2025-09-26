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
      console.log(col);
     const getRoot = document.getElementsByClassName('grid-container');
     console.log(getRoot);
     
      const myString = "test colspan";
      const searchTerm = "colspan";

      if (myString.includes(searchTerm)) {
        console.log(`"${myString}" contains "${searchTerm}"`); 
      }
    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

  /*Column Item Code*/
      console.log("column item");
      

}
