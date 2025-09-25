export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add('columns-main');
  console.log("columns");
  console.log(cols);
  console.log( block.classList);


  // setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      console.log(col.parentElement);
      col.parentElement.classList.add('grid-container'); 
      
      //Replace with authoring field
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
}
