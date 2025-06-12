export default async function decorateminicart() {
  const carticon = document.querySelector('.nav-tools .icon-cart-icon');
  // CART MODAL + OVERLAY
  const cartOverlay = document.createElement('div');
  cartOverlay.className = 'modal-overlay cart-overlay';
  cartOverlay.style.display = 'none';
  document.body.append(cartOverlay);

  const cartModal = document.createElement('div');
  cartModal.className = 'cart-modal';
  cartModal.style.display = 'none';
  cartModal.innerHTML = `
    <div class="modal-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8" fill="none">
        <path d="M16 7.31982H0L6.58579 0.734038C7.36684 -0.0470109 8.63317 -0.0470109 9.41421 0.734038L16 7.31982Z" fill="white"/>
      </svg>
      <p class="cart-title b2-bold">Your cart is empty.</p>
    </div>
  `;
  document.body.append(cartModal);

  function showCartModal() {
    cartModal.style.display = 'block';
    cartOverlay.style.display = 'block';
    carticon.classList.add('active');
  }

  function hideCartModal() {
    cartModal.style.display = 'none';
    cartOverlay.style.display = 'none';
    carticon.classList.remove('active');
  }

  function toggleCartModal() {
    const isVisible = cartModal.style.display === 'block';
    if (isVisible) {
      hideCartModal();
    } else {
      showCartModal();
    }
  }

  carticon.addEventListener('click', e => {
    e.stopPropagation();
    toggleCartModal();
  });

  cartOverlay.addEventListener('click', hideCartModal);

  document.addEventListener('click', e => {
    if (
      cartModal.style.display === 'block' &&
      !cartModal.contains(e.target) &&
      !carticon.contains(e.target)
    ) {
      hideCartModal();
    }
  });
}
