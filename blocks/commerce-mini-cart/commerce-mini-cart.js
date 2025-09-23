import { render as provider } from '@dropins/storefront-cart/render.js';
import MiniCart from '@dropins/storefront-cart/containers/MiniCart.js';
import { events } from '@dropins/tools/event-bus.js';
import { tryRenderAemAssetsImage } from '@dropins/tools/lib/aem/assets.js';
import * as cartApi from '@dropins/storefront-cart/api.js';

// Initializers
import '../../scripts/initializers/cart.js';

import { readBlockConfig } from '../../scripts/aem.js';
import { fetchPlaceholders, rootLink } from '../../scripts/commerce.js';

export default async function decorate(block) {
  const {
    'start-shopping-url': startShoppingURL = '',
    'cart-url': cartURL = '',
    'checkout-url': checkoutURL = '',
    'enable-updating-product': enableUpdatingProduct = 'false',
  } = readBlockConfig(block);

  // Get translations for custom messages
  const placeholders = await fetchPlaceholders();

  const MESSAGES = {
    ADDED: placeholders?.Global?.MiniCartAddedMessage,
    UPDATED: placeholders?.Global?.MiniCartUpdatedMessage,
  };

  // Create a container for the update message
  const updateMessage = document.createElement('div');
  updateMessage.className = 'commerce-mini-cart__update-message';
  const svgBefore = `
    <svg class="mini-cart-icon-before" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path d="M12.5 24.03C10.3125 24.03 8.29688 23.4988 6.45312 22.4363C4.64062 21.3425 3.1875 19.8894 2.09375 18.0769C1.03125 16.2332 0.5 14.2175 0.5 12.03C0.5 9.84253 1.03125 7.84253 2.09375 6.03003C3.1875 4.18628 4.64062 2.73315 6.45312 1.67065C8.29688 0.576904 10.3125 0.0300293 12.5 0.0300293C14.6875 0.0300293 16.6875 0.576904 18.5 1.67065C20.3438 2.73315 21.7969 4.18628 22.8594 6.03003C23.9531 7.84253 24.5 9.84253 24.5 12.03C24.5 14.2175 23.9531 16.2332 22.8594 18.0769C21.7969 19.8894 20.3438 21.3425 18.5 22.4363C16.6875 23.4988 14.6875 24.03 12.5 24.03ZM12.5 21.8269C14.2812 21.8269 15.9219 21.3894 17.4219 20.5144C18.9219 19.6394 20.1094 18.4519 20.9844 16.9519C21.8594 15.4519 22.2969 13.8113 22.2969 12.03C22.2969 10.2488 21.8594 8.60815 20.9844 7.10815C20.1094 5.60815 18.9219 4.42065 17.4219 3.54565C15.9219 2.67065 14.2812 2.23315 12.5 2.23315C10.7188 2.23315 9.07812 2.67065 7.57812 3.54565C6.07812 4.42065 4.89062 5.60815 4.01562 7.10815C3.14062 8.60815 2.70312 10.2488 2.70312 12.03C2.70312 13.8113 3.14062 15.4519 4.01562 16.9519C4.89062 18.4519 6.07812 19.6394 7.57812 20.5144C9.07812 21.3894 10.7188 21.8269 12.5 21.8269ZM12.5 15.4519C12.7188 15.4519 12.9219 15.4988 13.1094 15.5925C13.2969 15.655 13.4531 15.7644 13.5781 15.9207C13.7344 16.0457 13.8438 16.2019 13.9062 16.3894C14 16.5769 14.0469 16.78 14.0469 16.9988C14.0469 17.2175 14 17.4207 13.9062 17.6082C13.8438 17.7957 13.7344 17.9675 13.5781 18.1238C13.4531 18.2488 13.2969 18.3582 13.1094 18.4519C12.9219 18.5144 12.7188 18.5457 12.5 18.5457C12.2812 18.5457 12.0781 18.5144 11.8906 18.4519C11.7031 18.3582 11.5312 18.2488 11.375 18.1238C11.25 17.9675 11.1406 17.7957 11.0469 17.6082C10.9844 17.4207 10.9531 17.2175 10.9531 16.9988C10.9531 16.78 10.9844 16.5769 11.0469 16.3894C11.1406 16.2019 11.25 16.0457 11.375 15.9207C11.5312 15.7644 11.7031 15.655 11.8906 15.5925C12.0781 15.4988 12.2812 15.4519 12.5 15.4519ZM13.8125 5.37378V10.5769L13.7656 10.905C13.7656 11.3425 13.7344 11.78 13.6719 12.2175C13.6094 12.78 13.5312 13.3425 13.4375 13.905H11.5156L11.4688 13.4832C11.375 13.0457 11.3125 12.6238 11.2812 12.2175C11.2188 11.655 11.1875 11.1082 11.1875 10.5769V5.37378H13.8125Z" fill="black"/>
    </svg>
  `;

  const svgAfter = `
    <svg class="commerce-mini-cart__close-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M15.5442 13.3622L10.2086 8.02248L15.5442 2.6919C16.1477 2.08711 16.1486 1.0956 15.547 0.481675L15.5397 0.474361C14.9294 -0.118993 13.9411 -0.118536 13.3336 0.478475L8.00069 5.81637L2.67102 0.479389L2.66645 0.475275C2.05984 -0.114879 1.07198 -0.114879 0.464002 0.474818L0.458516 0.480303C0.160925 0.779723 -0.00181327 1.1756 1.52427e-05 1.59524C0.00184376 2.01123 0.165496 2.40116 0.45943 2.69235L5.7955 8.02248L0.461716 13.3599C0.168239 13.6452 0.000472393 14.0465 0.000929522 14.4611C0.00138665 14.8744 0.168239 15.2735 0.459887 15.5573C0.756107 15.8604 1.14832 16.0273 1.56568 16.0273C1.56614 16.0273 1.56614 16.0273 1.5666 16.0273C1.98441 16.0273 2.37754 15.859 2.67331 15.5546L8.00115 10.23L13.3313 15.5541C13.6243 15.8581 14.0156 16.0264 14.4339 16.0273C14.4352 16.0273 14.4366 16.0273 14.438 16.0273C14.8567 16.0273 15.2494 15.86 15.5456 15.556C15.835 15.2712 16.0005 14.8712 16 14.4579C15.9991 14.0374 15.8359 13.647 15.5442 13.3622Z" fill="black"/>
    </svg>
  `;
  // Create shadow wrapper
  const shadowWrapper = document.createElement('div');
  shadowWrapper.className = 'section commerce-mini-cart__message-wrapper';
  shadowWrapper.appendChild(updateMessage);

  const showMessage = (message) => {
    updateMessage.innerHTML = `
        <div class="message-center-group">
          ${svgBefore}
          <div class="commerce-mini-cart__update-message-text">
            ${message}
          </div>
        </div>
        ${svgAfter}
    `;
    // Add click event to close icon
    const closeIcon = updateMessage.querySelector('.commerce-mini-cart__close-icon');
    if (closeIcon) {
      closeIcon.tabIndex = 0;
      closeIcon.setAttribute('role', 'button');
      closeIcon.setAttribute('aria-label', 'Close cart update message');

      closeIcon.addEventListener('click', () => {
        shadowWrapper.classList.remove('commerce-mini-cart__message-wrapper--visible');
        updateMessage.classList.remove('commerce-mini-cart__update-message--visible');
      });
      closeIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          shadowWrapper.classList.remove('commerce-mini-cart__message-wrapper--visible');
          updateMessage.classList.remove('commerce-mini-cart__update-message--visible');
        }
      });
    }
    updateMessage.classList.add('commerce-mini-cart__update-message--visible');
    shadowWrapper.classList.add('commerce-mini-cart__message-wrapper--visible');
    setTimeout(() => {
      updateMessage.classList.remove('commerce-mini-cart__update-message--visible');
      shadowWrapper.classList.remove('commerce-mini-cart__message-wrapper--visible');
      window.location.reload();
    }, 3000);
  };

  // Add event listeners for cart updates
  events.on('cart/product/added', () => showMessage(MESSAGES.ADDED), {
    eager: true,
  });
  events.on('cart/product/updated', () => showMessage(MESSAGES.UPDATED), {
    eager: true,
  });

  block.innerHTML = '';

  // Render MiniCart
  const getProductLink = (product) => rootLink(`/products/${product.url.urlKey}/${product.topLevelSku}`);
  await provider.render(MiniCart, {
    routeEmptyCartCTA: startShoppingURL ? () => rootLink(startShoppingURL) : undefined,
    routeCart: cartURL ? () => rootLink(cartURL) : undefined,
    routeCheckout: checkoutURL ? () => rootLink(checkoutURL) : undefined,
    routeProduct: getProductLink,

    slots: {
      Thumbnail: (ctx) => {
        const { item, defaultImageProps } = ctx;
        const anchorWrapper = document.createElement('a');
        anchorWrapper.href = getProductLink(item);

        tryRenderAemAssetsImage(ctx, {
          alias: item.sku,
          imageProps: defaultImageProps,
          wrapper: anchorWrapper,

          params: {
            width: defaultImageProps.width,
            height: defaultImageProps.height,
          },
        });

        if (item?.itemType === 'ConfigurableCartItem' && enableUpdatingProduct === 'true') {
          const editLinkContainer = document.createElement('div');
          editLinkContainer.className = 'cart-item-edit-container';

          const editButton = document.createElement('button');
          editButton.className = 'cart-item-edit-link';
          editButton.textContent = 'Edit';

          editButton.addEventListener('click', () => {
            const productUrl = getProductLink(item);
            const params = new URLSearchParams();

            if (item.selectedOptionsUIDs) {
              const optionsValues = Object.values(item.selectedOptionsUIDs);
              if (optionsValues.length > 0) {
                const joinedValues = optionsValues.join(',');
                params.append('optionsUIDs', joinedValues);
              }
            }

            params.append('quantity', item.quantity);
            params.append('itemUid', item.uid);

            const finalUrl = `${productUrl}?${params.toString()}`;
            window.location.href = finalUrl;
          });

          editLinkContainer.appendChild(editButton);
          ctx.appendChild(editLinkContainer);
        }
      },
    },
  })(block);

  // Find the products container and add the message div at the top
  const productsContainer = document.querySelector('main');
  if (productsContainer) {
    productsContainer.prepend(shadowWrapper);
  } else {
    console.info('Products container not found, appending message to block');
    block.appendChild(shadowWrapper);
  }

  // Now fetch labels and add element
  const labels = await fetchPlaceholders();
  // Create label for EmptyCart.cta2
  const ctaElemlink = labels?.Cart?.EmptyCart?.cta2link;
  const ctaElem = document.createElement('a');
  ctaElem.innerText = labels?.Cart?.EmptyCart?.cta2;
  ctaElem.href = ctaElemlink || '#';
  ctaElem.className = 'dropin-secondary-variant';

  const existingdata = document.createElement('p');
  existingdata.className = 'already-items';
  existingdata.innerText = labels?.Cart?.EmptyCart?.exitingitems;

  const signin = document.createElement('a');
  signin.className = 'signin-link';
  signin.innerText = labels?.Cart?.EmptyCart?.signin;
  signin.href = labels?.Cart?.EmptyCart?.signinlink || '#';

  const detailsLabel = document.createElement('div');
  detailsLabel.innerText = labels?.Cart?.MiniCart?.details;

  function renderCart(cartData) {
    const cartItems = block.querySelectorAll('.dropin-cart-item');
    appendCartItemCountToIcon();
    splitCartHeading();
    addCartCloseButton();

    cartItems.forEach((item) => {
      const itemWrapper = item?.querySelector('.dropin-cart-item__wrapper');
      const sku = item?.querySelector('.dropin-cart-item__sku');
      const attributes = item.querySelector('.dropin-cart-item__attributes');
      const color = item.querySelector('.dropin-cart-item__configurations');
      const price = item?.querySelector('.dropin-cart-item__price');
      const dataTestId = item?.getAttribute('data-testid');
      const itemId = dataTestId?.split('cart-list-item-entry-')[1];
      const product = cartData?.items?.find((p) => p.uid === itemId);
      const left = cartData?.left_quantity?.find((p) => p.uid === itemId);
      const leftQuantity = left?.left_quantity ?? 0;
      const right = cartData?.right_quantity?.find((p) => p.uid === itemId);
      const rightQuantity = right?.right_quantity ?? 0;

      item.querySelectorAll('.dropin-cart-item__image img').forEach((img) => {
        img.src = 'https://mcstaging2.discountcontacts.com/media/catalog/product/placeholder/default/no-image_560x400px_1.png';
        img.srcset = '';
      });

      item
        ?.querySelectorAll('.dropin-cart-item__title.dropin-cart-item__title--edit')
        .forEach((span) => {
          const link = span.querySelector('a');
          if (link) {
            const text = link.textContent;
            if (text.length < 15) {
              span.classList.add('short-title');
              item
                .querySelectorAll('.dropin-cart-item__row-total__wrapper')
                .forEach((rowTotalWrapper) => {
                  rowTotalWrapper.classList.add('titlenew');
                });
            }
          }
        });

      // Create label for MiniCart.remove
      const removeElem = document.createElement('div');
      removeElem.innerText = labels?.Cart?.MiniCart?.remove;
      removeElem.className = 'remove-text';

      const priceElement = item?.querySelector(
        '.dropin-price.dropin-price--default.dropin-price--small.dropin-price--bold',
      );

      const framePrice = document.createElement('span');
      framePrice.innerText = labels?.Cart?.MiniCart?.framePrice;
      framePrice.className = 'frame-price';

      const lensops = document.createElement('div');
      lensops.innerText = labels?.Cart?.MiniCart?.lensOps;
      lensops.className = 'lens-options';

      const lensselectops = document.createElement('div');
      lensselectops.innerText = labels?.Cart?.MiniCart?.selectLens;
      lensselectops.className = 'lens-selectoptions';

      if (JSON.stringify(product?.categories) !== JSON.stringify(['Contact Lenses'])) {
        // Get color label
        const colorAttribute = product?.productAttributes?.find((attr) => attr.code === 'Color');
        const colorLabel = colorAttribute?.selected_options?.[0]?.label ?? 'No color';
        const colornames = document.createElement('div');
        colornames.innerText = `${labels?.Cart?.MiniCart?.colorName}${colorLabel}`;
        colornames.className = 'color-name';

        if (priceElement && colornames) {
          priceElement.parentNode.insertBefore(colornames, priceElement);
        }
      }

      if (priceElement && framePrice) {
        priceElement.parentNode.insertBefore(framePrice, priceElement);
      }

      priceElement.insertAdjacentElement('afterend', lensops);
      lensops.insertAdjacentElement('afterend', lensselectops);

      if (JSON.stringify(product?.categories) === JSON.stringify(['Contact Lenses'])) {
        const priceElements = item?.querySelector(
          '.dropin-price.dropin-price--default.dropin-price--small.dropin-price--bold',
        );
        const frameval = item?.querySelector('.frame-price');
        const eachval = item?.querySelector('.dropin-cart-item__price');
        const lops = item?.querySelector('.lens-options');
        const lsops = item?.querySelector('.lens-selectoptions');
        if (priceElements) {
          priceElements.style.display = 'none';
        }
        if (frameval) {
          frameval.style.display = 'none';
        }
        if (eachval) {
          eachval.style.display = 'none';
        }
        lops.style.display = 'none';
        lsops.style.display = 'none';
        const leftval = document.createElement('div');
        leftval.innerText = `${labels?.Cart?.MiniCart?.leftQty}${leftQuantity}`;
        leftval.className = 'leftqty';

        const rightval = document.createElement('div');
        rightval.innerText = `${labels?.Cart?.MiniCart?.rightQty}${rightQuantity}`;
        rightval.className = 'rightqty';

        if (priceElement && leftval && rightval) {
          priceElement.parentNode.insertBefore(rightval, priceElement);
          priceElement.parentNode.insertBefore(leftval, priceElement);
        }
      }

      const deleteicon = document.createElement('div');
      deleteicon.className = 'delete-icon';
      deleteicon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
      <path d="M11.047 7.30907C10.1176 7.59138 8.58879 7.9258 6.58662 7.9258C5.01876 7.9258 3.41615 7.70864 2.07413 7.30907C1.7484 7.21353 1.44004 7.10495 1.16643 6.99637C1.36621 9.48063 1.80052 14.523 1.80052 14.5403C1.80052 15.296 3.7332 16.1951 6.58228 16.1951C9.43136 16.1951 11.364 15.296 11.364 14.5403C11.364 14.5317 11.8288 9.44154 12.0416 6.9486C11.7462 7.07455 11.4075 7.2005 11.047 7.30907Z" fill="#295EDB"/>
      <path d="M12.7147 4.19941C12.7147 3.53492 11.5812 2.95294 9.8787 2.62286C9.8787 2.60549 9.88304 2.58378 9.88304 2.5664V0.768358C9.88304 0.451312 9.6268 0.195068 9.30975 0.195068H3.90693C3.58988 0.195068 3.33364 0.451312 3.33364 0.768358V2.49257C3.33364 2.536 3.33798 2.57943 3.35101 2.62286C1.63982 2.95294 0.50193 3.53492 0.50193 4.19941C0.50193 4.2081 0.497587 5.02894 0.50193 5.03763C0.714742 5.57618 3.26415 6.58812 6.60834 6.58812C9.92647 6.58812 12.376 5.58486 12.7104 5.01157C12.7191 4.99854 12.7147 4.21678 12.7147 4.19941ZM4.48022 2.44914V1.34165H8.73646V2.45348C8.07196 2.37965 7.35535 2.33622 6.60834 2.33622C5.86132 2.33188 5.14037 2.37531 4.48022 2.44914Z" fill="#295EDB"/>
      </svg>`;

      const removeContainer = document.createElement('div');
      removeContainer.className = 'remove-container';
      removeContainer.setAttribute('tabindex', '0');

      removeContainer.appendChild(removeElem);
      removeContainer.appendChild(deleteicon);

      const removeConfirm = document.createElement('div');
      removeConfirm.innerText = labels?.Cart?.MiniCart?.removeConfirm;
      removeConfirm.className = 'remove-confirm-text';

      const removeYesButton = document.createElement('button');
      removeYesButton.innerText = labels?.Cart?.MiniCart?.yes;
      removeYesButton.className = 'button secondary-variant';
      removeYesButton.setAttribute('aria-label', 'Yes, remove the item');

      removeYesButton.addEventListener('click', () => {
        const quantitySpan = item.querySelector('.dropin-cart-item__price__quantity');
        if (!quantitySpan) return;
        const currentQuantity = parseInt(quantitySpan.textContent.trim().split(' ')[0], 10);
        const newQuantity = Math.max(currentQuantity - 1, 0);
        quantitySpan.textContent = newQuantity > 0 ? `${newQuantity} x ` : '';
        showMessage(MESSAGES.UPDATED);
        // Update cart API
        cartApi.updateProductsFromCart([
          {
            uid: itemId,
            quantity: newQuantity,
          },
        ]);
        const miniCart = document?.querySelector('.commerce-mini-cart');
        if (miniCart) {
          miniCart.classList.remove('show');
          miniCart.classList.add('hidden');
        }
        // Update mini-cart count badge dynamically
        const count = document?.querySelector('.default-content-wrapper .cart-count-badge');
        if (count) {
          const currentCount = parseInt(count.textContent, 10) || 0;
          const updatedCount = Math.max(currentCount - 1, 0);
          count.textContent = updatedCount;
          count.style.display = updatedCount > 0 ? '' : 'none';
        }

        if (newQuantity === 0 && item) {
          item.remove();
        }
      });

      const removeNoButton = document.createElement('button');
      removeNoButton.innerText = labels?.Cart?.MiniCart?.no;
      removeNoButton.className = 'button secondary-variant';
      removeNoButton.setAttribute('aria-label', 'No, keep the item');

      removeConfirm.style.display = 'none';
      removeYesButton.style.display = 'none';
      removeNoButton.style.display = 'none';

      // Add event listener to delete icon
      removeContainer.addEventListener('click', () => {
        const removeButtonsContainer = removeContainer.nextElementSibling;
        const borderval = removeButtonsContainer;
        const isOpening = removeButtonsContainer.querySelector('.remove-confirm-text').style.display === 'none'
          || removeButtonsContainer.querySelector('.remove-confirm-text').style.display === '';

        if (isOpening) {
          borderval.style.borderTop = '1px solid #B0B0B0';
        } else {
          borderval.style.borderTop = '';
        }

        removeButtonsContainer.querySelector('.remove-confirm-text').style.display = isOpening
          ? 'block'
          : 'none';
        removeButtonsContainer.querySelector(
          '.button.secondary-variant:first-child',
        ).style.display = isOpening ? 'block' : 'none'; // Yes button
        removeButtonsContainer.querySelector('.button.secondary-variant:last-child').style.display = isOpening ? 'block' : 'none'; // No button
      });

      removeContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const removeButtonsContainer = removeContainer.nextElementSibling;
          const borderval = removeButtonsContainer;
          const bordervals = removeButtonsContainer.querySelector('.buttons-group');

          const isOpening = removeButtonsContainer.querySelector('.remove-confirm-text').style.display === 'none'
            || removeButtonsContainer.querySelector('.remove-confirm-text').style.display === '';

          if (isOpening) {
            borderval.style.borderTop = '1px solid #B0B0B0';
            bordervals.style.borderBottom = '1px solid #B0B0B0';
          } else {
            borderval.style.borderTop = '';
            bordervals.style.borderBottom = '';
          }

          removeButtonsContainer.querySelector('.remove-confirm-text').style.display = isOpening
            ? 'block'
            : 'none';
          removeButtonsContainer.querySelector(
            '.button.secondary-variant:first-child',
          ).style.display = isOpening ? 'block' : 'none'; // Yes button
          removeButtonsContainer.querySelector(
            '.button.secondary-variant:last-child',
          ).style.display = isOpening ? 'block' : 'none'; // No button
        }
      });

      // Add event listener for removeNoButton to hide both buttons
      removeNoButton.addEventListener('click', () => {
        const removeButtonsContainer = removeContainer.nextElementSibling;
        const borderval = removeButtonsContainer;
        const bordervals = removeButtonsContainer.querySelector('.buttons-group');

        removeButtonsContainer.querySelector('.remove-confirm-text').style.display = 'none';
        removeButtonsContainer.querySelector(
          '.button.secondary-variant:first-child',
        ).style.display = 'none';
        removeButtonsContainer.querySelector('.button.secondary-variant:last-child').style.display = 'none';
        borderval.style.borderTop = '';
        bordervals.style.borderBottom = '';
      });

      const removeButtonsContainer = document.createElement('div');
      removeButtonsContainer.className = 'remove-buttons-container';
      const btnwrap = document.createElement('div');
      btnwrap.className = 'buttons-group';
      removeButtonsContainer.appendChild(removeConfirm);
      btnwrap.appendChild(removeYesButton);
      btnwrap.appendChild(removeNoButton);
      removeButtonsContainer.appendChild(btnwrap);
      if (itemWrapper) {
        itemWrapper.insertAdjacentElement('afterend', removeButtonsContainer);
        itemWrapper.insertAdjacentElement('afterend', removeContainer);
      }
      const targets = [sku, attributes, price, color];

      // Hide elements initially
      targets.forEach((el) => {
        if (el) {
          el.style.display = 'none';
        }
      });

      if (price) {
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'custom-remove-toggle';
        toggleBtn.setAttribute('tabindex', '0');

        // SVGs
        const downArrowSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <path d="M12 3.07321C12 3.27404 11.9331 3.44141 11.7992 3.5753L6.0251 9.42467L0.200837 3.49998C0.0669456 3.36609 0 3.2071 0 3.023C0 2.82216 0.0669456 2.6548 0.200837 2.52091C0.334728 2.38701 0.493724 2.32007 0.677824 2.32007C0.878661 2.32007 1.04603 2.38701 1.17992 2.52091L6.0251 7.44141L10.8201 2.57111C10.954 2.43722 11.113 2.37028 11.2971 2.37028C11.4812 2.37028 11.6402 2.43722 11.7741 2.57111C11.9247 2.70501 12 2.87237 12 3.07321Z" fill="#295EDB"/>
          </svg>`;

        const upArrowSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <path d="M12 8.56693C12 8.36609 11.9331 8.19873 11.7992 8.06484L6.0251 2.21547L0.200837 8.14015C0.0669456 8.27404 0 8.43304 0 8.61714C0 8.81798 0.0669456 8.98534 0.200837 9.11923C0.334728 9.25312 0.493724 9.32007 0.677824 9.32007C0.878661 9.32007 1.04603 9.25312 1.17992 9.11923L6.0251 4.19873L10.8201 9.06902C10.954 9.20291 11.113 9.26986 11.2971 9.26986C11.4812 9.26986 11.6402 9.20291 11.7741 9.06902C11.9247 8.93513 12 8.76777 12 8.56693Z" fill="#295EDB"/>
          </svg>`;

        toggleBtn.innerHTML = `
          <span>${labels?.Cart?.MiniCart?.details || 'Details'}</span>
          <span class="toggle-icon">${downArrowSVG}</span>
        `;

        price.insertAdjacentElement('afterend', toggleBtn);

        let isVisible = false;

        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          isVisible = !isVisible;

          targets.forEach((el) => {
            if (el) {
              el.style.display = isVisible ? '' : 'none';
            }
          });

          const iconSpan = toggleBtn.querySelector('.toggle-icon');
          if (iconSpan) {
            iconSpan.innerHTML = isVisible ? upArrowSVG : downArrowSVG;
          }

          const cartItem = toggleBtn.closest('.dropin-cart-item');
          const rowTotalWrapper = cartItem?.querySelector('.dropin-cart-item__row-total__wrapper');

          if (rowTotalWrapper) {
            if (isVisible) {
              rowTotalWrapper.classList.add('opened');
              rowTotalWrapper.classList.remove('titlenew');
            } else {
              rowTotalWrapper.classList.remove('opened');
              const shortTitles = cartItem.querySelectorAll(
                '.dropin-cart-item__title.dropin-cart-item__title--edit.short-title',
              );
              if (shortTitles.length > 0) {
                rowTotalWrapper.classList.add('titlenew');
              }
            }
          }
        });
        toggleBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            isVisible = !isVisible;

            targets.forEach((el) => {
              if (el) {
                el.style.display = isVisible ? '' : 'none';
              }
            });

            const iconSpan = toggleBtn.querySelector('.toggle-icon');
            if (iconSpan) {
              iconSpan.innerHTML = isVisible ? upArrowSVG : downArrowSVG;
            }
          }
        });
      }
    });
  }

  let cartTimer;
  events.on('cart/data', (cartData) => {
    clearTimeout(cartTimer);
    cartTimer = setTimeout(() => {
      renderCart(cartData);
    }, 50);
  });
  // Append both to block
  const emptyCartButton = block.querySelector('[data-testid="cart-empty-cart-button"]');
  if (emptyCartButton) {
    emptyCartButton.insertAdjacentElement('afterend', ctaElem);
    emptyCartButton.insertAdjacentElement('beforebegin', existingdata);
    existingdata.insertAdjacentElement('afterend', signin);
    if (emptyCartButton) {
      emptyCartButton.href = labels?.Cart.EmptyCart.cta1link;
      const span = emptyCartButton.querySelector('span');
      if (span) {
        span.textContent = labels?.Cart?.EmptyCart?.cta1;
      }
    }
  }
  return block;
}
function addCartCloseButton() {
  setTimeout(() => {
    let headingWrapper = document.querySelector('.cart-cart-summary-list__heading');

    if (!headingWrapper) {
      headingWrapper = document.querySelector('.dropin-illustrated-message__heading');
    }

    // If still not found or button already exists, stop
    if (!headingWrapper || headingWrapper.parentElement.querySelector('.cart-close-button')) return;

    const closeBtn = document.createElement('span');
    closeBtn.setAttribute('tabindex', '0');
    closeBtn.className = 'cart-close-button';
    closeBtn.setAttribute('aria-label', 'Close cart');

    closeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path d="M11.6582 10.4889L7.65647 6.48408L11.6582 2.48615C12.1107 2.03256 12.1114 1.28892 11.6602 0.82848L11.6548 0.822995C11.1971 0.377979 10.4558 0.378322 10.0002 0.82608L6.00052 4.8295L2.00327 0.826766L1.99984 0.82368C1.54488 0.381065 0.803988 0.381065 0.348001 0.823338L0.343887 0.827452C0.120694 1.05202 -0.00135996 1.34892 1.14321e-05 1.66366C0.00138282 1.97565 0.124122 2.26809 0.344573 2.48649L4.34663 6.48408L0.346287 10.4872C0.126179 10.7011 0.000354295 11.0021 0.000697142 11.3131C0.00103999 11.623 0.126179 11.9223 0.344916 12.1352C0.56708 12.3625 0.861243 12.4877 1.17426 12.4877C1.17461 12.4877 1.17461 12.4877 1.17495 12.4877C1.48831 12.4877 1.78316 12.3615 2.00498 12.1332L6.00086 8.13969L9.99846 12.1328C10.2182 12.3608 10.5117 12.487 10.8254 12.4877C10.8264 12.4877 10.8275 12.4877 10.8285 12.4877C11.1425 12.4877 11.437 12.3622 11.6592 12.1342C11.8762 11.9206 12.0003 11.6206 12 11.3107C11.9993 10.9953 11.8769 10.7025 11.6582 10.4889Z" fill="#625E59"/>
      </svg>
    `;

    // Close logic
    closeBtn.addEventListener('click', () => {
      document.querySelector('.commerce-mini-cart')?.classList.remove('show');
      document.querySelector('.commerce-mini-cart')?.classList.add('hidden');
    });

    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        closeBtn.click();
      }
    });

    // If in empty cart case, wrap h2 and button inline
    if (headingWrapper.classList.contains('dropin-illustrated-message__heading')) {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'space-between';
      wrapper.style.alignItems = 'center';
      headingWrapper.parentNode.insertBefore(wrapper, headingWrapper);
      wrapper.appendChild(headingWrapper);
      wrapper.appendChild(closeBtn);
    } else {
      headingWrapper.appendChild(closeBtn);
    }
  }, 0);
}
function splitCartHeading() {
  const heading = document.querySelector('[data-testid="default-cart-heading"]');
  if (!heading) return;

  const text = heading.textContent.trim();
  const match = text.match(/^(.+?)\s*\((\d+)\)$/);

  if (match) {
    const [, title, count] = match;

    heading.innerHTML = `
      <span class="cart-heading-title">${title}</span>
      <span class="cart-heading-count"> (${count} items)</span>
    `;
  }
}
function appendCartItemCountToIcon() {
  const heading = document.querySelector('[data-testid="default-cart-heading"]');
  const match = heading?.textContent.match(/\((\d+)\)/);
  const count = match ? parseInt(match[1], 10) : 0;

  const cartIconWrapper = document.querySelector('.icon-cart-icon');

  if (!cartIconWrapper || document.querySelector('.cart-count-badge')) {
    return;
  }

  if (count > 0) {
    const badge = document.createElement('span');
    badge.className = 'cart-count-badge';

    // Create the inner span for the count value
    const countSpan = document.createElement('span');
    countSpan.className = 'count-val';
    countSpan.textContent = count; // Set the count value here

    // Append the count span inside the badge
    badge.appendChild(countSpan);

    const iconContainer = cartIconWrapper.parentElement;
    if (iconContainer) {
      iconContainer.style.position = 'relative';
      iconContainer.appendChild(badge);
    }
  }
}
