export default async function decoratemyaccount() {
  const myaccounticon = document.querySelector('.nav-tools .icon-account-icon');
  const pmyaccounticon = document.querySelector('.nav-tools p:has(.icon-account-icon)');
  const myaccounticonactive = document.querySelector('.nav-tools p:has(.icon-account-icon-active)');
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  // MY ACCOUNT MODAL + OVERLAY
  const accountOverlay = document.createElement('div');
  accountOverlay.className = 'modal-overlay account-overlay';
  accountOverlay.style.display = 'none';
  document.body.append(accountOverlay);

  const accountModal = document.createElement('div');
  accountModal.className = 'account-modal';
  accountModal.style.display = 'none';
  accountModal.innerHTML = `
    <div class="modal-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8" fill="none">
        <path d="M16 7.31982H0L6.58579 0.734038C7.36684 -0.0470109 8.63317 -0.0470109 9.41421 0.734038L16 7.31982Z" fill="white"/>
      </svg>
      <p class="account-title b2-bold">Sign In to Your Account.</p>
    </div>
  `;
  document.body.append(accountModal);

  function showAccountModal() {
    accountModal.style.display = 'block';
    accountOverlay.style.display = 'block';
    myaccounticon.classList.add('active');
  }

  function hideAccountModal() {
    accountModal.style.display = 'none';
    accountOverlay.style.display = 'none';
    myaccounticon.classList.remove('active');
    if (!isMobile) {
      myaccounticonactive.style.display = 'none';
      pmyaccounticon.style.display = 'block';
    }
  }

  function toggleAccountModal() {
    const isVisible = accountModal.style.display === 'block';
    if (isVisible) {
      hideAccountModal();
    } else {
      showAccountModal();
    }
  }
  function updateaccountIcon() {
    if (myaccounticon.classList.contains('active')) {
      if (!isMobile) {
        myaccounticonactive.style.display = 'block';
        pmyaccounticon.style.display = 'none';
      }
    }
  }

  // Initial update on page load
  updateaccountIcon();

  myaccounticon.addEventListener('click', e => {
    e.stopPropagation();
    toggleAccountModal();
    updateaccountIcon();
  });

  accountOverlay.addEventListener('click', hideAccountModal);

  document.addEventListener('click', e => {
    if (
      accountModal.style.display === 'block' &&
      !accountModal.contains(e.target) &&
      !myaccounticon.contains(e.target)
    ) {
      hideAccountModal();
    }
  });
}
