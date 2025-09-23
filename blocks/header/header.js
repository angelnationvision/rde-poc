import { getCookie } from '@dropins/tools/lib.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { fetchPlaceholders } from '../../scripts/commerce.js';
import decoratefav from '../header-favorite-icon/header-favorite-icon.js';
import decoratemyaccount from '../header-myaccount/header-myaccount.js';
import decoratesearch from '../header-search/header-search.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}
function isSafariBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');
}

// Usage
if (isSafariBrowser()) {
  console.log('Safari browser detected');
  // Apply Safari-specific CSS or logic here
  document.documentElement.classList.add('safari');
} else {
  document.documentElement.classList.add('chrome');
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .navigation-wrapper').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const subNav = nav.querySelector(".nav-drop[aria-expanded = 'true']");
  if (subNav) {
    subNav.setAttribute('aria-expanded', 'false');
  }
  const button = nav.querySelector('.nav-hamburger');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  // toggleAllNavSections(navSections, expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  const navtoolsList = nav.querySelector('.nav-tools');
  const navicons = navtoolsList.querySelectorAll('p .icon');
  const iconLabels = {
    'search-icon': 'Search icon',
    'favourite-icon': 'Wishlist/Favorites icon',
    'account-icon': 'My Account icon',
    'cart-icon': 'Mini Cart icon',
  };
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
    navicons.forEach((drop) => {
      const img = drop.querySelector('img');
      const iconName = img?.dataset.iconName;
      if (iconName && iconLabels[iconName]) {
        drop.setAttribute('aria-label', iconLabels[iconName]);
      }
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
    navicons.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const labels = await fetchPlaceholders();

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  const classes = [
    'carusal-button',
    'find-store',
    'book-exam-button',
    'brand',
    'sections',
    'tools',
  ];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);
    }
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.navigation-container');

  const iconWrapper = navSections?.querySelector('.default-content-wrapper') || null;

  const children = iconWrapper?.children ? Array.from(iconWrapper.children) : [];

  const [hamburgerIcon, closeIcon, rightArrow, leftArrow, plusIcon, minusIcon] = children;

  const navWrapperBox = document.createElement('div');
  navWrapperBox.className = 'navigation-wrapper-box';
  if (navSections) {
    const navHeader = document.createElement('div');
    navHeader.className = 'navigation-header';
    closeIcon.addEventListener('click', () => toggleMenu(nav, navSections));
    navHeader.append(closeIcon || '');
    navSections.prepend(navHeader);

    navSections.querySelectorAll(':scope > .navigation-wrapper').forEach((navSection) => {
      const navigationBlock = navSection.querySelector('.navigation.block');
      const navigationTitle = navSection.querySelector('.navigation-title');
      const btitle = navSection.querySelector(
        '.navigation-vertical-stack .navigation-column-card .brand-title',
      );
      const navigationColnWrapper = navSection?.querySelector('.navigation-columns-wrapper') || '';

      if (navigationBlock) {
        navSection.classList.add('nav-drop');
      }

      if (navigationTitle) {
        navigationTitle
          ?.querySelector('p')
          .append(rightArrow?.querySelector('span')?.cloneNode(true) || '');
        navigationTitle
          ?.querySelector('p')
          .append(leftArrow?.querySelector('span')?.cloneNode(true) || '');
      }
      rightArrow?.remove();
      leftArrow?.remove();

      if (navigationColnWrapper) {
        navigationColnWrapper.prepend(navigationTitle.cloneNode(true));
      }

      navSection.querySelectorAll('.navigation-column-title').forEach((navCol) => {
        if (navCol) {
          navCol.querySelector('p')?.append(plusIcon?.querySelector('span')?.cloneNode(true) || '');
          navCol
            .querySelector('p')
            ?.append(minusIcon?.querySelector('span')?.cloneNode(true) || '');
        }
        plusIcon?.remove();
        minusIcon?.remove();
      });

      navSection.addEventListener('click', (event) => {
        // if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        if (btitle && btitle.contains(event.target)) {
          navSection.setAttribute('aria-expanded', 'true');
          navSections.classList.add('nav-expanded');
        } else {
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
        if (expanded) {
          navSections.classList.remove('nav-expanded');
        } else {
          navSections.classList.add('nav-expanded');
        }
        // }
      });
      document.addEventListener('click', (e1) => {
        const expandedNav = navSection.getAttribute('aria-expanded') === 'true';
        if (expandedNav) {
          if (!navSection.contains(e1.target)) {
            navSection.setAttribute('aria-expanded', 'false');
            navSections.classList.remove('nav-expanded');
          }
        }
      });
      if (!navSection.closest('.navigation-wrapper-box')) {
        navWrapperBox.appendChild(navSection);
      }
    });
  }

  // hamburger for mobile
  // const hamburger = document.createElement('div');
  hamburgerIcon.classList.add('nav-hamburger');

  hamburgerIcon.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.querySelector('.nav-brand')?.prepend(hamburgerIcon);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-main-container';

  const navigationWrapper = document.createElement('div');
  navigationWrapper.className = 'navigation-main-container';

  const headerSection = document.createElement('div');
  headerSection.className = 'header-container-wrapper';
  navWrapper.append(headerSection);

  const navigationSection = document.createElement('div');
  navigationSection.className = 'navigation-wrapper';
  navWrapper.append(navigationSection);

  const carusalButton = nav.querySelector('.nav-carusal-button');
  const findaStore = nav.querySelector('.nav-find-store');
  const bookExamButton = nav.querySelector('.nav-book-exam-button');

  headerSection.append(carusalButton, findaStore, bookExamButton);

  const navTools = nav.querySelector('.nav-tools');
  navSections.append(navWrapperBox);

  navigationSection.append(navBrand, navSections, navTools);

  const breadcrumbContainer = nav.querySelector('.breadcrumb-container');

  if (!isDesktop.matches) {
    nav.append(headerSection);
    nav.append(navigationSection);
  } else {
    nav.append(headerWrapper);
    nav.append(navigationWrapper);
    headerWrapper.append(headerSection);
    navigationWrapper.append(navigationSection);
  }

  const breadcrumbMeta = getMetadata('breadcrumb');
  if (breadcrumbContainer) {
    if (breadcrumbMeta === 'yes') {
      nav.append(breadcrumbContainer);
    } else {
      nav.append(breadcrumbContainer);
      // breadcrumbContainer.remove();
    }
  }

  block.append(navWrapper);

  // Function to create the popover window
  function createPopover() {
    const popover = document.createElement('div');
    popover.className = 'popover';
    popover.innerHTML = `
      <div class="popover-content">
        <div class="search-input-container">
          <span class="search-button" aria-label="Search for stores" tabindex="0" role="button">
            <img src="/icons/search.svg" width="16" height="16" alt="Search icon"/>
          </span>
          <input type="text" id="pinCode" placeholder="City, State or ZIP code" class="search-input" aria-label="Enter city, state or ZIP code">
          <span class="close-button" aria-label="Clear search input" tabindex="0" role="button">
            <img src="/icons/close-icon-search.svg" width="12" height="12" alt="Clear search icon"/>
          </span>
        </div>
        <button class="currentLocationButton location-button">
          Use Current Location
        </button>
      </div>
    `;

    const isMobileViewport = window.innerWidth <= 900;
    const parentForPopover = isMobileViewport ? headerSection : findaStore;
    parentForPopover.append(popover);
    // Add close button functionality (if present)
    const closeButton = popover.querySelector('.close-button');
    if (closeButton) {
      const handleClearSearch = () => {
        const pinCodeInput = popover.querySelector('#pinCode');
        pinCodeInput.value = '';
        pinCodeInput.focus(); // Return focus to input after clearing
      };

      closeButton.addEventListener('click', handleClearSearch);

      // Add keyboard accessibility for close button
      closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClearSearch();
        }
      });
    }

    // Add search button functionality
    const searchButton = popover.querySelector('.search-button');

    const handleSearch = () => {
      const pinCodeInput = popover.querySelector('#pinCode');
      const searchVal = pinCodeInput.value.trim();
      if (searchVal || searchVal === '') {
        window.location.href = `${labels?.Store?.locatorUrl}?inputStoreValue=${searchVal}&addressline=${searchVal}&`;
      }
    };

    if (searchButton) {
      searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSearch();
      });

      // Add keyboard accessibility for search button
      searchButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          handleSearch();
        }
      });
    }

    const inputField = popover.querySelector('#pinCode');
    if (inputField) {
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }

    // Add focus trapping for better accessibility
    const focusableElements = popover.querySelectorAll('input, button, [tabindex="0"]');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Handle Tab key for focus trapping
    popover.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        }
      }
    });
  }

  // Function to show the popover
  function showPopover() {
    const popover = document.querySelector('.popover');
    popover.style.display = 'block';

    // Add show class for mobile animation
    setTimeout(() => {
      popover.classList.add('show');
    }, 10);

    // Add outside click handler and keyboard support
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('click', handleOutsideClick);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown', handleKeydown);
    // Show backdrop positioned below header/search area
    // eslint-disable-next-line no-use-before-define
    showStoreOverlay();
  }

  // Function to hide the popover
  function hidePopover() {
    const popover = document.querySelector('.popover');
    if (popover) {
      // Remove show class for mobile animation
      popover.classList.remove('show');

      // Hide after animation completes
      setTimeout(() => {
        popover.style.display = 'none';
        // Hide backdrop in sync with popover hide to avoid flicker
        // eslint-disable-next-line no-use-before-define
        hideStoreOverlay();
      }, 300);
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('click', handleOutsideClick);
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('keydown', handleKeydown);
    }
  }

  // Function to handle outside clicks
  function handleOutsideClick(event) {
    const popover = document.querySelector('.popover');

    if (popover && !popover.contains(event.target) && !findaStore.contains(event.target)) {
      hidePopover();
    }
  }
  // Function to handle keyboard events
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      hidePopover();
    }
  }

  function handleFindStoreClick() {
    if (!document.querySelector('.popover')) {
      createPopover();
    }
    showPopover();
    const navigatorI = document.querySelector('.currentLocationButton');

    // Remove any existing event listeners to avoid duplicates
    navigatorI.replaceWith(navigatorI.cloneNode(true));
    const newNavigatorI = document.querySelector('.currentLocationButton');

    const showLocationErrorModal = async (message) => {
      try {
        const modalContent = document.createElement('div');
        modalContent.className = 'default-content-wrapper';
        modalContent.innerHTML = `
          <h2>Location Access</h2>
          <p>${message}</p>
          <div class="section button-nvi-container">
          <div class="button-nvi-wrapper"><div class="button-nvi primary-variant block americas" data-block-name="button-nvi" data-block-status="loaded">
              <div>
                <div><p class="button-container"><a href="#" title="Ok" class="button" aria-label=""><span>Ok</span></a></p></div>
              </div>
            </div></div></div>
        `;
        const { createModal } = await import('../modal/modal.js');
        const { showModal } = await createModal([modalContent]);
        showModal();
      } catch (err) {
        alert(message);
      }
    };

    const handleLocationClick = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        if (permissionStatus.state === 'denied') {
          await showLocationErrorModal(
            'Sorry, we are unable to determine your location at this time.',
          );
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            window.location.href = `${labels.Store.locatorUrl}?inputStoreValue=${lat},${lng}&latitude=${lat}&longitude=${lng}&qp=My+Location&l=en`;
          },
          async (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              await showLocationErrorModal(
                'Sorry, we are unable to determine your location at this time.',
              );
            } else {
              await showLocationErrorModal(`Error getting location: ${error.message}`);
            }
          },
        );
      } catch (err) {
        await showLocationErrorModal(
          'Geolocation is not supported or permission could not be checked.',
        );
      }
    };

    newNavigatorI.addEventListener('click', handleLocationClick);
    newNavigatorI.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLocationClick();
      }
    });
  }

  const setupFindStoreHandler = () => {
    // clear previous handlers
    findaStore.removeEventListener('click', handleFindStoreClick);
    findaStore.addEventListener('click', handleFindStoreClick);

    // Make find store button keyboard accessible
    if (!findaStore.hasAttribute('tabindex')) {
      findaStore.setAttribute('tabindex', '0');
      findaStore.setAttribute('role', 'button');
      findaStore.setAttribute('aria-label', 'Find a store near you');
    }

    // Add keyboard support for find store button
    findaStore.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFindStoreClick();
      }
    });
  };

  setupFindStoreHandler();

  const cookieToken = getCookie('auth_dropin_user_token');
  if (cookieToken) {
    const accountIcon = document.querySelector('.icon.icon-account-icon');
    accountIcon?.classList.add('hide-account_icon');
    const accountIconActive = document.querySelector('p:has(.icon-account-icon-active)');
    if (accountIconActive) {
      accountIconActive.style.display = 'block';
    }
  } else {
    console.log('auth token not found');
  }
  window.addEventListener('resize', setupFindStoreHandler);

  // Backdrop helpers for Find a Store
  function ensureStoreOverlay() {
    let overlay = document.querySelector('.store-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'store-overlay hidden';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function showStoreOverlay() {
    const overlay = ensureStoreOverlay();
    const isMobileViewport = window.innerWidth <= 900;
    if (isMobileViewport) {
      // Position the overlay below the header area and size it to remaining viewport
      const headerNavWrapperEl = document.querySelector('header .nav-wrapper');
      const headerHeight = headerNavWrapperEl
        ? Math.round(headerNavWrapperEl.getBoundingClientRect().height)
        : 0;
      overlay.style.top = `${headerHeight}px`;
      overlay.style.height = `calc(100vh - ${headerHeight}px)`;
    } else {
      overlay.style.top = '0px';
      overlay.style.height = '100vh';
    }
    overlay.classList.remove('hidden');
  }

  function hideStoreOverlay() {
    const overlay = ensureStoreOverlay();
    overlay.classList.add('hidden');
  }

  // Keep overlay correctly positioned on resize while it is visible
  window.addEventListener('resize', () => {
    const overlay = document.querySelector('.store-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
      showStoreOverlay();
    }
  });

  function toggleIconVisibility() {
    const isMobile = window.innerWidth <= 900;

    const desktopIcons = [
      'icon-left-icon',
      'icon-right-icon',
      'icon-down-icon',
      'icon-favourite-icon',
    ];
    const mobileIcons = [
      'icon-left-mobile-icon',
      'icon-right-mobile-icon',
      'icon-down-mobile-icon',
    ];

    desktopIcons.forEach((className) => {
      document.querySelectorAll(`.${className}`).forEach((el) => {
        const parentP = el.closest('p');
        if (parentP) {
          parentP.style.display = isMobile ? 'none' : '';
        }
      });
    });

    mobileIcons.forEach((className) => {
      document.querySelectorAll(`.${className}`).forEach((el) => {
        const parentP = el.closest('p');
        if (parentP) {
          parentP.style.display = isMobile ? '' : 'none';
        }
      });
    });
  }

  toggleIconVisibility();

  window.addEventListener('resize', toggleIconVisibility);

  const favIconContainer = document.querySelector('.nav-tools .icon-favourite-icon');
  const favIconWrapper = document.querySelector('.nav-tools .header-favorite-icon.block');
  if (favIconContainer) {
    decoratefav(favIconContainer, favIconWrapper);
  }

  const myaccdisabled = document.querySelector('.icon.icon-account-icon.hide-account_icon');
  const myaccountContainer = document.querySelector('.nav-tools .icon-account-icon');
  if (myaccdisabled) {
    const myaccountContainer = document.querySelector('.icon-account-icon-active');
    decoratemyaccount(myaccountContainer);
  } else if (myaccountContainer) {
    decoratemyaccount(myaccountContainer);
  }

  const searchContainer = document.querySelector('.nav-tools .icon-search-icon');
  const searchblock = document.querySelector('.nav-tools .header-search.block');
  if (searchContainer) {
    decoratesearch(searchContainer, hamburgerIcon, searchblock);
  }

  // Inject and render mini cart
  const minicartContainer = document.querySelector('.commerce-mini-cart.block');
  const minicartChild = document.querySelector('.cart-mini-cart');

  if (minicartChild) {
    minicartChild.insertAdjacentHTML(
      'beforebegin',
      `
      <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8" fill="none">
        <path d="M16 7.31982H0L6.58579 0.734038C7.36684 -0.0470109 8.63317 -0.0470109 9.41421 0.734038L16 7.31982Z" fill="white"></path>
      </svg>
    `,
    );
  }

  // Show mini cart as modal popup when clicking cart icon
  const cartIconButton = document.querySelector('.icon-cart-icon');
  if (cartIconButton && minicartContainer) {
    minicartContainer.classList.add('hidden');

    // Toggle mini cart on cart icon click
    cartIconButton.addEventListener('click', (e) => {
      e.stopPropagation();
      minicartContainer.classList.toggle('hidden');
      minicartContainer.classList.toggle('show');
      cartIconButton.classList.toggle('active');
    });

    // Close cart when clicking outside or on other icons
    document.addEventListener('click', (e) => {
      const isInsideCart = minicartContainer.contains(e.target);
      const isCartIcon = cartIconButton.contains(e.target);

      // Close if click is outside or on any other icon
      if (!isInsideCart && !isCartIcon) {
        minicartContainer.classList.add('hidden');
        minicartContainer.classList.remove('show');
        cartIconButton.classList.remove('active');
      }
    });

    // Close cart when any other icon is clicked
    const otherIcons = document.querySelectorAll(
      '.icon-search-icon, .icon-favourite-icon, .icon-favourite-icon-active, .icon-account-icon, .icon-account-icon-active',
    );

    otherIcons.forEach((icon) => {
      icon.addEventListener('click', () => {
        minicartContainer.classList.add('hidden');
        minicartContainer.classList.remove('show');
        cartIconButton.classList.remove('active');
      });
    });

    // Optional: Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        minicartContainer.classList.add('hidden');
        minicartContainer.classList.remove('show');
        cartIconButton.classList.remove('active');
      }
    });
  }

  const faviconMobile = document.querySelector(
    '.header-favorite-icon-container > .default-content-wrapper',
  );

  if (faviconMobile) {
    faviconMobile.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('a')) {
        p.classList.add('fav-mobile-icon');
      }
    });
  }
}
