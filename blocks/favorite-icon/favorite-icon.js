export default async function decoratefav() {
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
    <p class="fav-title b2-bold">You have 0 Favorites.</p>
  </div>
`;
  document.body.append(modal);

  function showModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    favicon.classList.add('active');
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

  favicon.addEventListener('click', e => {
    e.stopPropagation();
    toggleModal();
    updateIcon();
  });

  overlay.addEventListener('click', hideModal);

  document.addEventListener('click', e => {
    if (
      modal.style.display === 'block' &&
      !modal.contains(e.target) &&
      !favicon.contains(e.target)
    ) {
      hideModal();
    }
  });
}
