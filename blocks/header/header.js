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

    navSections.querySelectorAll(':scope > .navigation-wrapper').forEach(navSection => {
      const navigationBlock = navSection.querySelector('.navigation.block');
      const navigationTitle = navSection.querySelector('.navigation-title');
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

      navSection.querySelectorAll('.navigation-column-title').forEach(navCol => {
        if (navCol) {
          navCol.querySelector('p').append(plusIcon?.querySelector('span')?.cloneNode(true) || '');
          navCol.querySelector('p').append(minusIcon?.querySelector('span')?.cloneNode(true) || '');
        }
        plusIcon?.remove();
        minusIcon?.remove();
      });

      navSection.addEventListener('click', () => {
        // if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) {
          navSections.classList.remove('nav-expanded');
        } else {
          navSections.classList.add('nav-expanded');
        }
        // }
      });
      document.addEventListener('click', e1 => {
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
  nav.querySelector('.logo-container')?.prepend(hamburgerIcon);
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
  const favIconWrapper = document.querySelector('.nav-tools .favorite-icon.block');
  if (favIconContainer) {
    decoratefav(favIconContainer, favIconWrapper);
  }

  const myaccountContainer = document.querySelector('.nav-tools .icon-account-icon');
  if (myaccountContainer) {
    decoratemyaccount(myaccountContainer);
  }

  const searchContainer = document.querySelector('.nav-tools .icon-search-icon');
  const searchblock = document.querySelector('.nav-tools .navigation-search.block');
  if (searchContainer) {
    decoratesearch(searchContainer, hamburgerIcon, searchblock);
  }

  const minicartContainer = document.querySelector('.nav-tools .icon-cart-icon');
  if (minicartContainer) {
    decorateminicart(minicartContainer);
  }

  const faviconMobile = document.querySelector(
    '.favorite-icon-container > .default-content-wrapper'
  );

  if (faviconMobile) {
    faviconMobile.querySelectorAll('p').forEach(p => {
      if (p.querySelector('a')) {
        p.classList.add('fav-mobile-icon');
      }
    });
  }
}
