export default function decorate(block) {
const cols = [...block.firstElementChild.children];



// setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
    const attr = document.querySelector('[class*="gap-"]');
    if (attr != null) {
          const gapName = attr.className.split(" ");
          const gapClass = gapName[1];
          col.parentElement.classList.add(gapClass);
          block.classList.remove(gapClass);
      }
      col.parentElement.classList.add('grid-container');    
      col.parentElement.setAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }  
            const colnode = "colnode-";
            const colgrid = "colgrid-"; 
            const all_elements_array = Array.from(col.querySelectorAll('*'));           
            
            if (col.innerHTML.includes(colnode)) {
              col.parentElement.removeAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
              const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
              const getElement = matching_elements.at(-1);
              const eleString = getElement.textContent.trim().replace('colnode-', '');
              col.classList.add(eleString);
             // const remove = getElement.remove();
            }    
           if (col.innerHTML.includes(colgrid)) {
              const matching_elements_cg = all_elements_array.filter(element => element.innerHTML.includes(colgrid));
                matching_elements_cg.forEach(function(item, index, array) {
                   const eleStringcg = item.textContent.trim();
                    col.classList.add(eleStringcg);
                   // const removecg = item.remove();
                });
            }
    
    });
  });

 
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
