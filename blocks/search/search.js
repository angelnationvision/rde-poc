export default async function decoratesearch(searchContainer, hamburger, searchblock) {
  const navTools = document.querySelector('.nav-tools .default-content-wrapper');
  const navBrand = document.querySelector('.nav-brand');
  const navSections = document.querySelector('.navigation-container');
  const findstorehide = document.querySelector('.header-container-wrapper .nav-find-store');
  const bookexamehide = document.querySelector('.header-container-wrapper .nav-book-exam-button');
  const searchicon = searchContainer;

  searchicon.style.cursor = 'pointer';

  const headerpart = document.querySelector('.nav-wrapper');
  const navpart = document.querySelector('.navigation-wrapper');

  // const headerHeight = headerpart?.offsetHeight || 0;

  const searchoverlay = document.createElement('div');
  searchoverlay.className = 'search-overlay hidden';
  if (window.matchMedia('(max-width: 900px)').matches) {
    searchoverlay.style.top = '107px';
  } else {
    searchoverlay.style.top = '173px';
  }
  document.body.appendChild(searchoverlay);

  if (searchblock) {
    searchblock.classList.add('search-input-wrapper', 'hidden');
    const directDivs = Array.from(searchblock.querySelectorAll(':scope > div'));

    if (directDivs.length >= 5) {
      // Wrap first div in .input-label
      // const inputLabel = document.createElement('div');
      // inputLabel.className = 'input-label';
      // const pTag = directDivs[0].querySelector('p');
      // if (pTag) {
      //   pTag.classList.add('b-regular');
      // }
      // searchblock.replaceChild(inputLabel, directDivs[0]);
      // inputLabel.appendChild(directDivs[0]);

      // Re-collect direct children since DOM has changed
      const updatedDivs = Array.from(searchblock.querySelectorAll(':scope > div'));
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'search-box';

      searchblock.insertBefore(wrapperDiv, updatedDivs[0]);

      const cancelButtonWrapper = searchblock.querySelector(':scope > div:nth-child(5)');
      if (cancelButtonWrapper) {
        cancelButtonWrapper.classList.add('cancel-btn');
        // const cancelLink = cancelButtonWrapper.querySelector('a');
        // if (cancelLink) {
        //   cancelLink.removeAttribute('href');
        // }
      }

      // Add class to the link text container
      const linkTextWrapper = searchblock.querySelector(':scope > div:nth-child(6)');
      if (linkTextWrapper) {
        linkTextWrapper.classList.add('cancel-txt');

        // Extract and sanitize the text to use as a class name
        const textValue = linkTextWrapper.textContent
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-_]/g, '');
        if (textValue) {
          cancelButtonWrapper.classList.add(textValue);
        }
      }

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= 2; i++) {
        wrapperDiv.appendChild(directDivs[i]);
      }

      // Add input field
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      const placeholderValue = wrapperDiv.children[2]?.textContent.trim() || '';
      searchInput.placeholder = placeholderValue;
      wrapperDiv.insertBefore(searchInput, wrapperDiv.children[1]);

      // Add class to search icon container
      const searchIconContainer = wrapperDiv.children[0];
      searchIconContainer.classList.add('search-icon-inside');

      // Add class to close icon container
      const closeIcon = wrapperDiv.children[2];
      closeIcon.classList.add('close-icon');

      // Add class to placeholder container
      const placeholderContainer = wrapperDiv.children[3];
      placeholderContainer.classList.add('placeholder');

      // ** Wrap wrapperDiv, cancelButtonWrapper, and linkTextWrapper in a single parent div **
      const searchElementsWrapper = document.createElement('div');
      searchElementsWrapper.className = 'search-elements-wrapper';

      // Insert wrapper before wrapperDiv
      searchblock.insertBefore(searchElementsWrapper, wrapperDiv);

      // Move wrapperDiv, cancelButtonWrapper, and linkTextWrapper into searchElementsWrapper
      searchElementsWrapper.appendChild(wrapperDiv);

      if (cancelButtonWrapper && cancelButtonWrapper.parentElement === searchblock) {
        searchElementsWrapper.appendChild(cancelButtonWrapper);
      }

      if (linkTextWrapper && linkTextWrapper.parentElement === searchblock) {
        searchElementsWrapper.appendChild(linkTextWrapper);
      }

      // Event: Open search UI
      const openSearchUI = e => {
        e.stopPropagation();
        if (searchblock.classList.contains('hidden')) {
          navSections.style.visibility = 'hidden';
        } else {
          navSections.style.visibility = 'visible';
        }
        navpart.classList.add('input-opened');
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (isMobile) {
          navBrand.style.visibility = 'hidden';
          hamburger.style.visibility = 'hidden';
          bookexamehide.style.visibility = 'hidden';
          findstorehide.style.visibility = 'hidden';
        }

        if (!isMobile) {
          if (document.querySelector('.navigation-wrapper.input-opened')) {
            document.querySelector('.navigation-wrapper').style.height = '87px';
            headerpart.style.position = 'fixed';
          }
        }
        searchblock.classList.remove('hidden');
        searchoverlay.classList.remove('hidden');
        searchInput.focus();
        navTools.style.display = 'none';
      };

      searchicon.addEventListener('click', openSearchUI);

      document.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          openSearchUI(e); // Trigger the same action
        }
      });

      // Event: Clear input
      closeIcon.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
      });

      // Event: Cancel search
      cancelButtonWrapper.addEventListener('click', e => {
        e.preventDefault(); // Prevent page navigation
        searchblock.classList.add('hidden');
        searchoverlay.classList.add('hidden');
        navSections.style.visibility = 'visible';
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (isMobile) {
          navBrand.style.visibility = 'visible';
          hamburger.style.visibility = 'visible';
          bookexamehide.style.visibility = 'visible';
          findstorehide.style.visibility = 'visible';
        } else {
          document.querySelector('.navigation-wrapper').style.height = '64px';
          headerpart.style.position = 'static';
        }
        navpart.classList.remove('input-opened');
        navTools.style.display = '';
        searchInput.value = '';
      });

      // Optional: Hide on outside click
      document.addEventListener('click', e => {
        if (!searchblock.contains(e.target) && e.target !== searchicon) {
          searchblock.classList.add('hidden');
          searchoverlay.classList.add('hidden');
          navpart.classList.remove('input-opened');
          navSections.style.visibility = 'visible';
          navSections.style.visibility = 'visible';
          const isMobile = window.matchMedia('(max-width: 900px)').matches;
          if (isMobile) {
            navBrand.style.visibility = 'visible';
            hamburger.style.visibility = 'visible';
            bookexamehide.style.visibility = 'visible';
            findstorehide.style.visibility = 'visible';
          } else {
            document.querySelector('.navigation-wrapper').style.height = '64px';
            headerpart.style.position = 'static';
          }
          navTools.style.display = '';
          searchInput.value = '';
        }
      });
    }
  }
}
