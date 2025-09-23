import { getHeaders } from '@dropins/tools/lib/aem/configs.js';
import { initializers } from '@dropins/tools/initializer.js';
import { initialize, setFetchGraphQlHeaders } from '@dropins/storefront-cart/api.js';
import { initializeDropin } from './index.js';
import { fetchPlaceholders } from '../commerce.js';

await initializeDropin(async () => {
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders('cart') }));

  const labels = await fetchPlaceholders('placeholders/cart.json');

  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  const models = {
    CartModel: {
      transformer: (data) => {
        const rightQuantityItems = data.itemsV2.items.map((item) => ({
          right_quantity: item.right_quantity,
          uid: item.uid,
        }));

        const leftQuantityItems = data.itemsV2.items.map((item) => ({
          left_quantity: item.left_quantity,
          uid: item.uid,
        }));

        return {
          right_quantity: rightQuantityItems,
          left_quantity: leftQuantityItems,
        };
      },
    },
  };

  return initializers.mountImmediately(initialize, {
    langDefinitions,
    models,
  });
})();
