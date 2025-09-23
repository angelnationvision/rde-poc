const basePath = window.location.origin;
const configFile = `${basePath}/config.json`;


export async function commerceEndpointWithQueryParams(config) {
  const urlWithQueryParams = new URL(config['commerce-endpoint']);
  // Set some query parameters for use as a cache-buster. No other purpose.
  const hash = createHashFromObject(config.headers?.cs ?? {});
  urlWithQueryParams.searchParams.append('cb', hash);
  return urlWithQueryParams;
}

function createHashFromObject(obj, length = 5) {
  // Sort entries by key and create a string of key-value pairs
  const objString = Object.entries(obj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  // Create a short hash using a simple string manipulation
  return objString
    .split('')
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 2147483647, 0)
    .toString(36)
    .slice(0, length);
}

async function performCatalogServiceQuery(query, config, variables) {
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers?.all,
    ...config.headers?.cs,
  };

  const apiCall = await commerceEndpointWithQueryParams(config);

  const response = await fetch(apiCall, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: query.replace(/(?:\r\n|\r|\n|\t|[\s]{4})/g, ' ').replace(/\s\s+/g, ' '),
      variables,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const queryResponse = await response.json();

  return queryResponse.data;
}



// search.js
export const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

export const productSearchQuery = (addCategory = false) => `query ProductSearch(
  $currentPage: Int = 1
  $pageSize: Int = 20
  $phrase: String = ""
  $sort: [ProductSearchSortInput!] = []
  $filter: [SearchClauseInput!] = []
) {
  productSearch(
      current_page: $currentPage
      page_size: $pageSize
      phrase: $phrase
      sort: $sort
      filter: $filter
  ) {
      items {
          productView {
              id
              name
              sku
              inStock
              urlKey
              url
              images(roles: []) {
                url
                label
                roles
              }
              attributes(roles: []) {
                  name
                  label
                  value
              }
              __typename
             
             
          }
      }
      page_info {
          current_page
          total_pages
          page_size
      }
      total_count
      suggestions
  }
}
`;


export const getColorFromAttributes = (attributes) => {
  const colorAttr = attributes?.find(attr => attr.name === 'color');
  return colorAttr?.value?.trim() || '';
};

export const createColorSwatch = (colorValue) => {
  const styleListDiv = document.createElement('div');
  styleListDiv.className = 'tab-style-list';
  // Check if the value is a valid color or URL (optional)
  const colorArray = colorValue.split('/');
  colorArray?.forEach((colorValue, index) => {
      const styleBox = document.createElement('div');
      styleBox.className = 'tab-style-box';
    const styleColor = document.createElement('span');
    styleColor.className = 'tab-style-color';
      if (colorValue && colorValue.toLowerCase() !== 'no color' && CSS.supports('color', colorValue)) {
        styleColor.style.backgroundColor = colorValue;
        styleBox.appendChild(styleColor);
        styleListDiv.appendChild(styleBox);
      }
    });
      return styleListDiv;
};

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

const renderSearchUI = (response,query,searchblock) => {
  const imageUrls = {
    'glasses': [
      '/content/dam/nvi-aem-commerce/media_19e8404db03c66a9b1abbcb97e010a07e70add917.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_1cdb10a72ca0da5c18567c927d719018d157fa36e.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_16b87cacdbc5b27d5bdcb0b24ab541ef35aba8f4b.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_16b76927852499e78cfe33380548acdc459c27f65.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_1cdb10a72ca0da5c18567c927d719018d157fa36e.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_18278287651dce82815a909efdcf89b80a1425df5.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_1ff1aca79206a366afd60a744913ba75000dd1c6a.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_16592a06d7c9981b1447b11a572bbe56e6b809084.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_1be426445474af29df157a969507e33a3cfc30875.svg?width=750&format=svg&optimize=medium',
      '/content/dam/nvi-aem-commerce/media_1ff1aca79206a366afd60a744913ba75000dd1c6a.svg?width=750&format=svg&optimize=medium',
    ]
  };
  const productDetails = response.productSearch;
  const navContainer = document.querySelector('.navigation-main-container');
  const navSearchWrapper = document.querySelector('.header-search-wrapper');
  const resultContainer = document?.querySelector('.nav-results-container')
  if (productDetails?.total_count > 0 || productDetails?.suggestions?.length > 0) {
    if(!resultContainer) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'nav-results-container';
      if(isMobile()) {
        navSearchWrapper.appendChild(wrapperDiv);
      } else {
        navContainer.appendChild(wrapperDiv);
      }
    }

    const suggestions = productDetails?.suggestions;
    document.querySelector('.suggestion-container')?.remove();

    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'suggestion-container';
    if (suggestions.length > 0) {
      const suggestionWrapper = searchblock.querySelector(':scope > div:nth-child(2)');
      const suggestionText = suggestionWrapper.textContent.trim() || '';
      const suggestionTitle = document.createElement('div');
      suggestionTitle.textContent = suggestionText;
      suggestionTitle.className = 'suggestion-title'
      suggestionContainer.appendChild(suggestionTitle);
      //suggestionWrapper.remove();

      const suggestionListWrapper = document.createElement('div');
      suggestionListWrapper.className = 'suggestion-list-wrapper';


      suggestions.forEach((item, i) => {
        const text = item?.trim();
        if (!text) {
          return;
        }

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = text;
        link.className = 'suggestion-link';

        suggestionListWrapper.appendChild(link);
      });

      suggestionContainer.appendChild(suggestionListWrapper);
    }
          document.querySelector('.nav-results-container')?.appendChild(suggestionContainer);
    
    const products = productDetails?.items;
    document.querySelector('.search-result-container')?.remove();
     const searchInput = document.getElementById('header-search-input');
     if (searchInput.value.trim() === "" || searchInput.value.length < 3) {
      document.querySelector('.nav-results-container')?.remove();
      return;
     }
     const resultWrapper = document.createElement('div');
     resultWrapper.className = 'search-result-container';
    if (products.length > 0) {
      const resultTextWrapper = searchblock.querySelector(':scope > div:nth-child(3)');
      const titleRow = document.createElement('div');
      titleRow.className = 'search-title-row';
      const resultTitle = document.createElement('div');
      resultTitle.className = 'search-title';
      resultTitle.textContent = resultTextWrapper.textContent?.trim() || '';
      
      const ViewAllTextWrapper = searchblock.querySelector(':scope > div:nth-child(4)');
      const ViewAllType = searchblock.querySelector(':scope > div:nth-child(5)');
      const clonedViewAllTextWrapper = ViewAllTextWrapper.cloneNode(true); 
      clonedViewAllTextWrapper.style.display = 'flex';
      const viewBtnType = ViewAllType.textContent.trim() || '';
      clonedViewAllTextWrapper.classList.add(viewBtnType);

      titleRow.appendChild(resultTitle);
      titleRow.appendChild(clonedViewAllTextWrapper);
      resultWrapper.appendChild(titleRow);

      const productListWrapper = document.createElement('div');
      productListWrapper.className = 'result-list-wrapper';

      products.forEach((product, index) => {
        const p = product.productView;
        const linkUrl = `/products/${p.urlKey}/${p.sku}`;
        const productName = p.name;
        const inStock = p.inStock;
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';

        const anchor = document.createElement('a');
        anchor.href = linkUrl;

        const imgTag = document.createElement('img');
        if (imageUrls['glasses']?.length > 0) {
          imgTag.src = `https://dev--nvi-aem-commerce--national-vision.aem.live${imageUrls[`glasses`][index]}`
        } else {
          imgTag.src = p.images[0];
        }
        anchor.appendChild(imgTag);


        const titleP = document.createElement('p');
        titleP.textContent = productName;
        anchor.appendChild(titleP);

        const colorValue = getColorFromAttributes(product.productView.attributes);
        const colorSwatch = createColorSwatch(colorValue);
        anchor.appendChild(colorSwatch);

        productDiv.appendChild(anchor);
        if (!inStock) {
          const ofStockContainer = document.createElement('div');
          ofStockContainer.className = 'out-stock-container';
          const ofStockContent = document.createElement('div');
          ofStockContent.className = 'out-stock-content';
          ofStockContent.textContent = 'OUT OF STOCK';
          const ofStockImg = document.createElement('img');
          ofStockImg.src = '/images/FlagEnd.svg';
          ofStockContainer.appendChild(ofStockContent);
          ofStockContainer.appendChild(ofStockImg);
          productDiv.appendChild(ofStockContainer);
        }

        productListWrapper.appendChild(productDiv);
      });

      resultWrapper.appendChild(productListWrapper);
      

    }
    document.querySelector('.nav-results-container')?.appendChild(resultWrapper);
    
    const searchInput1 = document.getElementById('header-search-input');
     if (searchInput.value.trim() === "") {
      document.querySelector('.search-result-container')?.remove();
      return;
     }

  }else {
    resultContainer?.remove();
  }
}

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
    searchoverlay.style.top = '103px';
  } else {
    //searchoverlay.style.top = '173px';
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

       const suggestWrapper = searchblock.querySelector(':scope > div:nth-child(7)');
      const resultWrapper = searchblock.querySelector(':scope > div:nth-child(8)');
      const viewAllWrapper = searchblock.querySelector(':scope > div:nth-child(9)');
      const viewTypeWrapper = searchblock.querySelector(':scope > div:nth-child(10)');
       suggestWrapper.style.display = 'none';
       resultWrapper.style.display = 'none';
       viewAllWrapper.style.display = 'none';
       viewTypeWrapper.style.display = 'none';

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= 2; i++) {
        wrapperDiv.appendChild(directDivs[i]);
      }

       const suggestionDiv = searchblock.querySelector(':scope > div:nth-child(8)');
       
      // Add input field
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'header-search-input';
      const placeholderValue = wrapperDiv.children[2]?.textContent.trim() || '';
      searchInput.placeholder = placeholderValue;
      wrapperDiv.insertBefore(searchInput, wrapperDiv.children[1]);
      searchInput.addEventListener('input', handleInput);
      // Add class to search icon container
      const searchIconContainer = wrapperDiv.children[0];
      searchIconContainer.classList.add('search-icon-inside');
      searchIconContainer.id = "header-search_btn-icon";
      searchIconContainer.setAttribute("tabindex", "0");

      // Add class to close icon container
      const closeIcon = wrapperDiv.children[2];
      closeIcon.classList.add('close-icon');
      closeIcon.setAttribute('role', 'button');
      closeIcon.setAttribute('aria-label', 'Close');
      closeIcon.setAttribute('tabindex', '0');

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
          navSections.style.display = 'none';
        } else {
          navSections.style.display = 'flex';
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
            //document.querySelector('.navigation-wrapper').style.height = '87px';
           // headerpart.style.position = 'fixed';
          }
        }
        searchblock.classList.remove('hidden');
        searchoverlay.classList.remove('hidden');
        searchInput.focus();
        navTools.style.display = 'none';
      };

      searchicon.addEventListener('click', openSearchUI);
      searchicon.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          openSearchUI(e); // Trigger the same action
        }
      });

      // Event: Clear input
      closeIcon.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        const el = document.querySelector('.nav-results-container');
        if (el) {
          el.remove();
        }
      });

      // Event: Cancel search
      cancelButtonWrapper.addEventListener('click', e => {
        e.preventDefault(); // Prevent page navigation
        searchblock.classList.add('hidden');
        searchoverlay.classList.add('hidden');
        navSections.style.display = 'flex';
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (isMobile) {
          navBrand.style.visibility = 'visible';
          hamburger.style.visibility = 'visible';
          bookexamehide.style.visibility = 'visible';
          findstorehide.style.visibility = 'visible';
        } else {
         // document.querySelector('.navigation-wrapper').style.height = '64px';
          headerpart.style.position = 'static';
        }
        navpart.classList.remove('input-opened');
        navTools.style.display = '';
        //searchInput.value = '';
      });
      
      const baseUrldomain = window.location.origin; 
    const jsonSearchpageUrl = `${baseUrldomain}/searchpages.json`;

async function searchRedirect(inputValue) {
  try {
    const response = await fetch(jsonSearchpageUrl);
    const dataJson = await response.json();
    const data = dataJson.data;
    const baseUrl = window.location.origin;
    let searchText = inputValue.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchedPage = data.find(
      (dp) => dp.p_key.toLowerCase() === searchText
    );

    if (matchedPage) {
      window.location.href = `${baseUrl}${matchedPage.p_url}`;
    }
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}


const searchInputHeader = document.getElementById("header-search-input");
const searchButton = document.getElementById("header-search_btn-icon"); 
searchInputHeader?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchRedirect(event.target.value);
  }
});
      searchButton?.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          searchButton.click();
        }
      });

searchButton?.addEventListener("click", () => {
  searchRedirect(searchInputHeader.value);
});

      
      // Optional: Hide on outside click
      document.addEventListener('click', e => {
        if (!searchblock.contains(e.target) && e.target !== searchicon) {
          searchblock.classList.add('hidden');
          searchoverlay.classList.add('hidden');
          navpart.classList.remove('input-opened');
          navSections.style.display = 'flex';
          navSections.style.display = 'flex';
          const isMobile = window.matchMedia('(max-width: 900px)').matches;
          if (isMobile) {
            navBrand.style.visibility = 'visible';
            hamburger.style.visibility = 'visible';
            bookexamehide.style.visibility = 'visible';
            findstorehide.style.visibility = 'visible';
          } else {
           // document.querySelector('.navigation-wrapper').style.height = '64px';
            headerpart.style.position = 'static';
          }
          navTools.style.display = '';
          //searchInput.value = '';
        }
      });
    }
  }

let debounceTimer;
  function handleInput(event) {
    const query = event.target.value;
    if(query.length <= 2) {
      const el = document.querySelector('.nav-results-container');
      if (el) {
        el.remove();
        return;
      }
    }
    if (query.length >= 3) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const variables = {
          pageSize: 8,
          currentPage: 1,
          sort: [],
          phrase: query,
          //filter: [{ attribute: 'categories', in: 'sunglasses' }]
          filter: []
        };
        try {
          
  const config = await fetch(configFile)
    .then((res) => res.json())
    .then((data) => data.public.default)
    .catch((err) => {
      console.error(err);
      return {};
    });
          const response = await performCatalogServiceQuery(productSearchQuery(true), config, variables);
          renderSearchUI(response,query,searchblock);
        } catch (error) {
          console.error("Search failed:", error);
        }
      }, 300); // Wait 300ms after the last keystroke before triggering the query
    }
  }
}
