export default async function decoratesearch(searchContainer, hamburger) {
  const navTools = document.querySelector('.nav-tools');
  const navBrand = document.querySelector('.nav-brand');
  const navSections = document.querySelector('.navigation-container');
  const searchicon = searchContainer;
  // --- SEARCH INPUT LOGIC ---
  searchicon.style.cursor = 'pointer';

  // Find the height of the header + nav to exclude from overlay
  const headerpart = document.querySelector('.header-container-wrapper');
  const navpart = document.querySelector('.navigation-wrapper');

  const headerHeight = (headerpart?.offsetHeight || 0) + (navpart?.offsetHeight || 0);

  // Create and insert overlay
  const searchoverlay = document.createElement('div');
  searchoverlay.className = 'search-overlay hidden';
  searchoverlay.style.top = `${headerHeight}px`;
  document.body.appendChild(searchoverlay);

  // Create search container
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-input-wrapper hidden';

  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';

  const searchIconInside = document.createElement('span');
  searchIconInside.className = 'search-icon-inside';
  searchIconInside.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.375 10.7188C7.20833 10.7188 7.96875 10.5208 8.65625 10.125C9.36458 9.72917 9.92708 9.1875 10.3438 8.5C10.7604 7.79167 10.9688 7.03125 10.9688 6.21875C10.9688 5.40625 10.7604 4.65625 10.3438 3.96875C9.92708 3.28125 9.36458 2.73958 8.65625 2.34375C7.96875 1.92708 7.20833 1.71875 6.375 1.71875C5.54167 1.71875 4.77083 1.92708 4.0625 2.34375C3.35417 2.73958 2.79167 3.28125 2.375 3.96875C1.95833 4.65625 1.75 5.40625 1.75 6.21875C1.75 7.03125 1.95833 7.79167 2.375 8.5C2.79167 9.1875 3.35417 9.72917 4.0625 10.125C4.77083 10.5208 5.54167 10.7188 6.375 10.7188ZM15.5938 13.6562C15.8646 13.9271 16 14.25 16 14.625C16 15 15.8646 15.3229 15.5938 15.5938C15.3229 15.8646 14.9896 16 14.5938 16C14.2188 16 13.8854 15.8646 13.5938 15.5938L10.3438 12.4062C10.0521 12.1146 9.91667 11.7708 9.9375 11.375C8.85417 12.0833 7.66667 12.4375 6.375 12.4375C5.20833 12.4375 4.13542 12.1667 3.15625 11.625C2.19792 11.0625 1.42708 10.3021 0.84375 9.34375C0.28125 8.38542 0 7.34375 0 6.21875C0 5.09375 0.28125 4.0625 0.84375 3.125C1.42708 2.16667 2.19792 1.40625 3.15625 0.84375C4.13542 0.28125 5.19792 0 6.34375 0C7.51042 0 8.57292 0.28125 9.53125 0.84375C10.5104 1.40625 11.2812 2.16667 11.8438 3.125C12.4271 4.0625 12.7188 5.09375 12.7188 6.21875C12.7188 6.92708 12.6042 7.61458 12.375 8.28125C12.1458 8.92708 11.8125 9.52083 11.375 10.0625C11.75 10.0625 12.0625 10.1979 12.3125 10.4688L15.5938 13.6562Z" fill="#295EDB"/>
    </svg>`;

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search for a product...';

  const closeIcon = document.createElement('span');
  closeIcon.className = 'close-icon';
  closeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M11.6582 9.99913L7.65647 5.99434L11.6582 1.9964C12.1107 1.54281 12.1114 0.799178 11.6602 0.338734L11.6548 0.333248C11.1971 -0.111767 10.4558 -0.111424 10.0002 0.336334L6.00052 4.33976L2.00327 0.33702L1.99984 0.333934C1.54488 -0.108681 0.803988 -0.108681 0.348001 0.333591L0.343887 0.337706C0.120694 0.56227 -0.00135996 0.859176 1.14321e-05 1.17391C0.00138282 1.4859 0.124122 1.77835 0.344573 1.99674L4.34663 5.99434L0.346287 9.99742C0.126179 10.2114 0.000354295 10.5124 0.000697142 10.8233C0.00103999 11.1333 0.126179 11.4326 0.344916 11.6455C0.56708 11.8728 0.861243 11.9979 1.17426 11.9979C1.17461 11.9979 1.17461 11.9979 1.17495 11.9979C1.48831 11.9979 1.78316 11.8718 2.00498 11.6434L6.00086 7.64995L9.99846 11.6431C10.2182 11.8711 10.5117 11.9972 10.8254 11.9979C10.8264 11.9979 10.8275 11.9979 10.8285 11.9979C11.1425 11.9979 11.437 11.8724 11.6592 11.6445C11.8762 11.4309 12.0003 11.1309 12 10.8209C11.9993 10.5055 11.8769 10.2127 11.6582 9.99913Z" fill="#625E59"/>
  </svg>`;

  searchBox.appendChild(searchIconInside);
  searchBox.appendChild(searchInput);
  searchBox.appendChild(closeIcon);

  // Create custom cancel button structure
  const cancelButtonWrapper = document.createElement('div');
  cancelButtonWrapper.className = 'cancel-button link-btn';

  const innerDiv = document.createElement('div');
  const pTag = document.createElement('p');
  pTag.className = 'button-container';

  const aTag = document.createElement('a');
  aTag.href = '';
  aTag.title = 'cancel';
  aTag.className = 'button';
  aTag.textContent = 'Cancel';

  pTag.appendChild(aTag);
  innerDiv.appendChild(pTag);
  cancelButtonWrapper.appendChild(innerDiv);

  // Add to DOM
  searchWrapper.appendChild(searchBox);
  searchWrapper.appendChild(cancelButtonWrapper);

  // Add search UI just after nav-tools
  navTools.insertAdjacentElement('afterend', searchWrapper);

  // Event: Open search UI
  searchicon.addEventListener('click', e => {
    e.stopPropagation();
    if (searchWrapper.classList.contains('hidden')) {
      navSections.style.visibility = 'hidden';
    } else {
      navSections.style.visibility = 'visible';
    }
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (isMobile) {
      navBrand.style.visibility = 'hidden';
      hamburger.style.visibility = 'hidden';
    }
    navpart.classList.add('input-opened');
    if (!isMobile) {
      document.querySelector('.navigation-wrapper').style.height = '64px';
    }
    searchWrapper.classList.remove('hidden');
    searchoverlay.classList.remove('hidden');
    searchInput.focus();
    navTools.style.display = 'none';
  });

  // Event: Clear input
  closeIcon.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
  });

  // Event: Cancel search
  aTag.addEventListener('click', e => {
    e.preventDefault(); // Prevent page navigation
    searchWrapper.classList.add('hidden');
    searchoverlay.classList.add('hidden');
    navSections.style.visibility = 'visible';
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (isMobile) {
      navBrand.style.visibility = 'visible';
      hamburger.style.visibility = 'visible';
    }
    navpart.classList.remove('input-opened');
    navTools.style.display = '';
    searchInput.value = '';
  });

  // Optional: Hide on outside click
  document.addEventListener('click', e => {
    if (!searchWrapper.contains(e.target) && e.target !== searchicon) {
      searchWrapper.classList.add('hidden');
      searchoverlay.classList.add('hidden');
      navpart.classList.remove('input-opened');
      navSections.style.visibility = 'visible';
      navSections.style.visibility = 'visible';
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      if (isMobile) {
        navBrand.style.visibility = 'visible';
        hamburger.style.visibility = 'visible';
      }
      navTools.style.display = '';
      searchInput.value = '';
    }
  });
}
