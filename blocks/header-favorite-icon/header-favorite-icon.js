export default async function decoratefav(favIconContainer, favIconWrapper) {
  const favicon = document.querySelector('.nav-tools .icon-favourite-icon');
  const pfavicon = document.querySelector('.nav-tools p:has(.icon-favourite-icon)');
  const faviconactive = document.querySelector('.nav-tools p:has(.icon-favourite-icon-active)');

  // FAVICON MODAL + OVERLAY
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay fav-overlay';
  overlay.style.display = 'none';
  document.body.append(overlay);
  const modal = document.createElement('div');
  modal.className = 'fav-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8" fill="none">
        <path d="M16 7.31982H0L6.58579 0.734038C7.36684 -0.0470109 8.63317 -0.0470109 9.41421 0.734038L16 7.31982Z" fill="white"/>
      </svg>
    </div>
  `;

  const children = Array.from(favIconWrapper.children);
  const firstWrapper = document.createElement('div');
  firstWrapper.classList.add('fav-signout-group');
  const secondWrapper = document.createElement('div');
  secondWrapper.classList.add('fav-signin-group');
  const signoutElement = ['fav-message', 'fav-signin', 'fav-note'];
  const signinElement = ['fav-title', 'fav-viewall-btn'];
  children.slice(0, 3).forEach((child, i) => {
    child.classList.add(signoutElement[i]);
    firstWrapper.appendChild(child);
  });
  children.slice(3).forEach((child, i) => {
    child.classList.add(signinElement[i]);
    secondWrapper.appendChild(child);
  });
  favIconWrapper.append(firstWrapper, secondWrapper);
  modal.append(favIconWrapper);
  faviconactive.append(modal);
  const link = favIconWrapper.querySelector('.fav-signin a');
  if (link) {
    link.classList.remove('button');
    link.classList.add('text-btn');
  }
  function showModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    favicon.classList.add('active');
    link.focus();
  }
  function hideModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    favicon.classList.remove('active');
    faviconactive.style.display = 'none';
    pfavicon.style.display = 'block';
  }
  function toggleModal() {
    const isVisible = modal.style.display === 'block';
    if (isVisible) {
      hideModal();
    } else {
      const mlink = document.querySelector('.fav-signin a');
      mlink?.focus();
      showModal();
    }
  }
  function updateIcon() {
    if (favicon.classList.contains('active')) {
      faviconactive.style.display = 'block';
      pfavicon.style.display = 'none';
    }
  }
  // Initial update on page load
  updateIcon();
  favicon.addEventListener('click', (e) => {
    link.focus();
    e.stopPropagation();
    toggleModal();
    updateIcon();
  });

  overlay.addEventListener('click', hideModal);
  document.addEventListener('click', (e) => {
    if (
      modal.style.display === 'block'
      && !modal.contains(e.target)
      && !favicon.contains(e.target)
    ) {
      hideModal();
    }
  });
  favicon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      showModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    const isVisible = modal.style.display === 'block';
    if (isVisible) {
      const iconAccount = document.querySelector('.icon-account-icon');
      if (e.key === 'Escape') {
        hideModal();
        iconAccount.focus();
      }
    }
  });

  const hearticon = document.querySelector('.faviconactive');
  hearticon?.addEventListener('click', () => {
    hearticon.classList.toggle('active');
  });
  const iconcartClick = document.querySelector('.icon-cart-icon');
  iconcartClick.addEventListener('click', hideModal);
}
