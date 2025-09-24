export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add('columns-main');
  const classString = block.className;
  const firstcolClass = document.querySelectorAll('[class*="firstcol-"]');
  console.log("new test");
  console.log(classString);
  console.log(firstcolClass);
  firstcolClass.forEach(element => {
    console.log("foreach firstcol");
          console.log(element.classList.value); // Logs the full class list of the element
        });
  


  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
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
