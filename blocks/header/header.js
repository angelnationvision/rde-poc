import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decoratefav from '../favorite-icon/favorite-icon.js';
import decoratemyaccount from '../myaccount/myaccount.js';
import decoratesearch from '../search/search.js';
import decorateminicart from '../mini-cart/mini-cart.js';

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
  sections.querySelectorAll('.nav-sections .navigation-wrapper').forEach(section => {
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
  const expanded =
    forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
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
    navDrops.forEach(drop => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
    navicons.forEach(drop => {
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
    navDrops.forEach(drop => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
    navicons.forEach(drop => {
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

  if (navSections) {
    navSections.querySelectorAll(':scope > .navigation-wrapper').forEach(navSection => {
      const navigationBlock = navSection.querySelector('.navigation.block');

      if (navigationBlock) {
        navSection.classList.add('nav-drop');
      }

      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

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

  navigationSection.append(navBrand, navSections, navTools);

  const breadcrumbContainer = nav.querySelector('.breadcrumb-container');

  nav.append(headerSection);
  nav.append(navigationSection);

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
      <input type="text" id="pinCode" placeholder="Enter Pin Code">
      <button class="goButton">Go</button>
      <button class="currentLocationButton">Use Current Location</button>
    `;
    findaStore.append(popover);
  }

  // Function to show the popover
  function showPopover() {
    const popover = document.querySelector('.popover');
    popover.style.display = 'block';

    // Add outside click handler
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('click', handleOutsideClick);
  }

  // Function to hide the popover
  function hidePopover() {
    const popover = document.querySelector('.popover');
    if (popover) {
      popover.style.display = 'none';
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  // Function to handle outside clicks
  function handleOutsideClick(event) {
    const popover = document.querySelector('.popover');

    if (popover && !popover.contains(event.target) && !findaStore.contains(event.target)) {
      hidePopover();
    }
  }

  // Event listener for the "find a store" button
  // eslint-disable-next-line func-names
  findaStore.addEventListener('click', function (event) {
    event.preventDefault();

    if (!document.querySelector('.popover')) {
      createPopover();
    }
    showPopover();
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

    desktopIcons.forEach(className => {
      document.querySelectorAll(`.${className}`).forEach(el => {
        const parentP = el.closest('p');
        if (parentP) {
          parentP.style.display = isMobile ? 'none' : '';
        }
      });
    });

    mobileIcons.forEach(className => {
      document.querySelectorAll(`.${className}`).forEach(el => {
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
  if (favIconContainer) {
    decoratefav(favIconContainer);
  }

  const myaccountContainer = document.querySelector('.nav-tools .icon-account-icon');
  if (myaccountContainer) {
    decoratemyaccount(myaccountContainer);
  }

  const searchContainer = document.querySelector('.nav-tools .icon-search-icon');
  if (searchContainer) {
    decoratesearch(searchContainer, hamburger);
  }

  const minicartContainer = document.querySelector('.nav-tools .icon-cart-icon');
  if (minicartContainer) {
    decorateminicart(minicartContainer);
  }
}
