function updateCarousel(index, listItems) {
  listItems.forEach(item => item.classList.remove('active'));
  listItems[index].classList.add('active');
}

function scrollRight(currentIndex, listItems) {
  const nextIndex = (currentIndex + 1) % listItems.length;
  updateCarousel(nextIndex, listItems);
  return nextIndex;
}

function scrollLeft(currentIndex, listItems) {
  const prevIndex = (currentIndex - 1 + listItems.length) % listItems.length;
  updateCarousel(prevIndex, listItems);
  return prevIndex;
}

export default function decorate(block) {
  const [props] = [...block.children].map(row => row.firstElementChild);
  const [listItemsContainer] = props.children;

  const listItems = [...listItemsContainer.querySelectorAll('li')];
  let currentIndex = 0;

  const carousel = document.createElement('div');
  carousel.classList.add('carousel-items');

  let intervalId;

  const startDefaultScroll = () => {
    intervalId = setInterval(() => {
      currentIndex = scrollRight(currentIndex, listItems);
    }, 3000);
  };

  // clearing the interval and resetting it whenever next/prev buttons are clicked
  const resetInterval = () => {
    clearInterval(intervalId);
    startDefaultScroll();
  };

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('prev-btn-left');

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('next-btn-right');

  carousel.addEventListener('click', e => {
    if (e.target.classList.contains('next-btn-right')) {
      currentIndex = scrollRight(currentIndex, listItems);
      resetInterval();
    } else if (e.target.classList.contains('prev-btn-left')) {
      currentIndex = scrollLeft(currentIndex, listItems);
      resetInterval();
    }
  });

  carousel.appendChild(prevBtn);
  carousel.appendChild(listItemsContainer);
  carousel.appendChild(nextBtn);

  block.textContent = '';
  block.append(carousel);

  updateCarousel(currentIndex, listItems);
  startDefaultScroll();
}
