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
            const allequal = "allequal";
          const all_elements_array = Array.from(col.querySelectorAll('*')); 
           
        //Look at all cols for all equal selected - if so, delete all others
         if (col.innerHTML.includes(allequal)) {
            col.parentElement.setAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
       
            const matching_elements_equal = all_elements_array.filter(element => element.innerHTML.includes(allequal));
            const getElementeq = matching_elements_equal.at(-1);
            const removeeq = getElementeq.remove();
            const allequalvalue = true;
          }
          else {
            //All equal was true above - so now delete the rest
            if (allequalvalue) {
              console.log("all equal was triggered and dont run anything else");
              const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
              const getElement = matching_elements.at(-1);
              const remove = getElement.remove();
            }
            //All equal was not true
            else {
                  //Checks each item Appends to each of the individual columns and uses default 1 if author didn't author
                  if (col.innerHTML.includes(colnode)) {
                      const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
                      const getElement = matching_elements.at(-1);
                      const eleString = getElement.textContent.trim().replace('colnode-', '');
                      col.classList.add(eleString);
                      const remove = getElement.remove();
                  }
                  else {
                    col.classList.add('colspan-1');
                  }
            }
          }
    
    });
  });

  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
