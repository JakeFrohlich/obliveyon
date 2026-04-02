/**
 * Obliveyon Theme — vanilla JS
 * Cart (Shopify AJAX API), mobile menu, product page, newsletter, scroll animations,
 * settings page (volume / notifications localStorage), image carousel
 */

(function () {
  'use strict';

  /* =========================================================================
     Utilities
     ========================================================================= */

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function fetchJSON(url, opts) {
    return fetch(url, opts).then(function (r) {
      if (!r.ok) throw new Error('Network response was not ok');
      return r.json();
    });
  }

  /* =========================================================================
     Cart — Shopify AJAX Cart API
     ========================================================================= */

  var Cart = {
    state: null,

    /** Fetch current cart state */
    fetch: function () {
      return fetchJSON('/cart.js').then(function (cart) {
        Cart.state = cart;
        Cart.render();
        Cart.updateBadge();
        return cart;
      }).catch(function (err) {
        console.warn('Cart fetch failed:', err);
      });
    },

    /** Add item to cart */
    add: function (variantId, quantity) {
      return fetchJSON('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity || 1 })
      }).then(function () {
        return Cart.fetch();
      });
    },

    /** Update item quantity by line-item key */
    update: function (key, quantity) {
      return fetchJSON('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      }).then(function () {
        return Cart.fetch();
      });
    },

    /** Remove item (quantity 0) */
    remove: function (key) {
      return Cart.update(key, 0);
    },

    /** Update the header cart badge and any floating cart icon counts */
    updateBadge: function () {
      var badges = document.querySelectorAll('[data-cart-count]');
      var count = Cart.state ? Cart.state.item_count : 0;
      badges.forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';
      });
    },

    /** Render cart drawer contents (JS-rendered fallback drawer) */
    render: function () {
      var container = document.querySelector('[data-cart-items]');
      var footer = document.querySelector('[data-cart-footer]');
      var emptyMsg = document.querySelector('[data-cart-empty]');
      if (!container) return;

      var cart = Cart.state;
      if (!cart || cart.items.length === 0) {
        container.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = '';
        if (footer) footer.style.display = 'none';
        return;
      }

      if (emptyMsg) emptyMsg.style.display = 'none';
      if (footer) footer.style.display = '';

      container.innerHTML = cart.items.map(function (item) {
        return (
          '<div class="cart-drawer__item">' +
            '<div class="cart-drawer__item-image">' +
              (item.image
                ? '<img src="' + Cart.imageSize(item.image, '160x') + '" alt="' + Cart.escape(item.title) + '" loading="lazy">'
                : '') +
            '</div>' +
            '<div class="cart-drawer__item-details">' +
              '<h3 class="cart-drawer__item-title">' + Cart.escape(item.product_title) + '</h3>' +
              (item.variant_title && item.variant_title !== 'Default Title'
                ? '<p class="cart-drawer__item-variant">' + Cart.escape(item.variant_title) + '</p>'
                : '') +
              '<p class="cart-drawer__item-price">' + formatMoney(item.final_line_price) + '</p>' +
              '<div class="cart-drawer__item-actions">' +
                '<button class="cart-drawer__qty-btn" data-cart-change="' + item.key + '" data-qty="' + (item.quantity - 1) + '" aria-label="Decrease quantity">&minus;</button>' +
                '<span class="cart-drawer__qty-value">' + item.quantity + '</span>' +
                '<button class="cart-drawer__qty-btn" data-cart-change="' + item.key + '" data-qty="' + (item.quantity + 1) + '" aria-label="Increase quantity">+</button>' +
                '<button class="cart-drawer__remove" data-cart-remove="' + item.key + '">Remove</button>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      /* Subtotal */
      var subtotalEl = document.querySelector('[data-cart-subtotal]');
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

      /* Bind events on newly rendered items */
      Cart.bindItemEvents();
    },

    /** Bind click events inside the cart drawer */
    bindItemEvents: function () {
      document.querySelectorAll('[data-cart-change]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = this.getAttribute('data-cart-change');
          var qty = parseInt(this.getAttribute('data-qty'), 10);
          if (qty <= 0) {
            Cart.remove(key);
          } else {
            Cart.update(key, qty);
          }
        });
      });
      document.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = this.getAttribute('data-cart-remove');
          Cart.remove(key);
        });
      });
    },

    /** Resize Shopify CDN image URL */
    imageSize: function (url, size) {
      if (!url) return '';
      return url.replace(/(\.[^.]+)$/, '_' + size + '$1');
    },

    /** Basic HTML escaping */
    escape: function (str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  };

  /* =========================================================================
     Cart Drawer — open / close (JS-rendered drawer, works alongside Shopify native)
     ========================================================================= */

  var CartDrawer = {
    drawer: null,
    overlay: null,

    init: function () {
      CartDrawer.drawer = document.querySelector('[data-cart-drawer]');
      CartDrawer.overlay = document.querySelector('[data-cart-overlay]');

      /* Open buttons — data-open-cart */
      document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          CartDrawer.open();
        });
      });

      /* Close buttons — data-close-cart */
      document.querySelectorAll('[data-close-cart]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          CartDrawer.close();
        });
      });

      /* Overlay click */
      if (CartDrawer.overlay) {
        CartDrawer.overlay.addEventListener('click', function () {
          CartDrawer.close();
        });
      }

      /* Escape key */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          if (CartDrawer.drawer && CartDrawer.drawer.classList.contains('is-open')) {
            CartDrawer.close();
          }
          /* Also close Shopify native cart-drawer */
          var nativeDrawer = document.querySelector('cart-drawer');
          if (nativeDrawer && typeof nativeDrawer.close === 'function') {
            nativeDrawer.close();
          }
        }
      });

      /* Initial cart fetch */
      Cart.fetch();
    },

    open: function () {
      if (CartDrawer.drawer) {
        CartDrawer.drawer.classList.add('is-open');
      }
      if (CartDrawer.overlay) {
        CartDrawer.overlay.classList.add('is-open');
      }
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      if (CartDrawer.drawer) {
        CartDrawer.drawer.classList.remove('is-open');
      }
      if (CartDrawer.overlay) {
        CartDrawer.overlay.classList.remove('is-open');
      }
      document.body.style.overflow = '';
    }
  };

  /* =========================================================================
     Mobile Menu
     ========================================================================= */

  var MobileMenu = {
    init: function () {
      var toggle = document.querySelector('[data-mobile-toggle]');
      var menu = document.querySelector('[data-mobile-menu]');
      if (!toggle || !menu) return;

      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });

      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  };

  /* =========================================================================
     Product Page — variant selection, add-to-cart, image gallery, carousel
     ========================================================================= */

  var ProductPage = {
    variantsData: null,
    currentMediaIndex: 0,
    mediaItems: [],

    init: function () {
      var form = document.querySelector('[data-product-form]');
      if (!form) return;

      /* Load variants JSON */
      var variantsEl = document.getElementById('product-variants-json');
      if (variantsEl) {
        try {
          ProductPage.variantsData = JSON.parse(variantsEl.textContent);
        } catch (e) {
          ProductPage.variantsData = null;
        }
      }

      ProductPage.initSizeSelector(form);
      ProductPage.initColorSelector(form);
      ProductPage.initAddToCart(form);
      ProductPage.initGallery();
      ProductPage.initCarousel();
      ProductPage.initQuantityStepper();
    },

    /** Size selector buttons */
    initSizeSelector: function (form) {
      var buttons = form.querySelectorAll('[data-size-btn]');
      var sizeDisplay = form.querySelector('[data-selected-size]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');

          if (sizeDisplay) {
            sizeDisplay.textContent = btn.textContent.trim();
          }

          ProductPage.updateVariantFromSelections(form);

          /* Re-enable add button */
          var addBtn = form.querySelector('[data-add-to-cart]');
          if (addBtn && !addBtn.dataset.soldOut) {
            addBtn.disabled = false;
          }
        });
      });
    },

    /** Color swatch selector */
    initColorSelector: function (form) {
      var swatches = form.querySelectorAll('[data-color-name]');
      var colorDisplay = form.querySelector('[data-selected-color]');

      swatches.forEach(function (swatch) {
        swatch.addEventListener('click', function () {
          var pos = swatch.getAttribute('data-option-position');
          form.querySelectorAll('[data-option-position="' + pos + '"]').forEach(function (s) {
            s.classList.remove('is-selected');
          });
          swatch.classList.add('is-selected');

          if (colorDisplay) {
            colorDisplay.textContent = swatch.getAttribute('data-color-name');
          }

          ProductPage.updateVariantFromSelections(form);
        });
      });
    },

    /** Find matching variant from selected option buttons and update hidden input + price */
    updateVariantFromSelections: function (form) {
      if (!ProductPage.variantsData) return;

      /* Build selected options map: position -> value */
      var selected = {};
      form.querySelectorAll('[data-option-position][data-option-value]').forEach(function (el) {
        if (el.classList.contains('is-selected')) {
          var pos = parseInt(el.getAttribute('data-option-position'), 10);
          selected[pos] = el.getAttribute('data-option-value');
        }
      });

      /* Find matching variant */
      var matched = null;
      ProductPage.variantsData.forEach(function (variant) {
        var matches = true;
        Object.keys(selected).forEach(function (pos) {
          var optionKey = 'option' + pos;
          if (variant[optionKey] !== selected[pos]) {
            matches = false;
          }
        });
        if (matches && !matched) matched = variant;
      });

      if (matched) {
        /* Update hidden variant ID */
        var idInput = form.querySelector('[data-variant-id-input]') || form.querySelector('[name="id"]');
        if (idInput) idInput.value = matched.id;

        /* Update price display */
        var priceEl = document.querySelector('[data-product-price]');
        if (priceEl) {
          priceEl.textContent = formatMoney(matched.price);
        }

        /* Update availability */
        var addBtn = form.querySelector('[data-add-to-cart]');
        var addText = form.querySelector('[data-add-text]');
        if (addBtn) {
          if (matched.available) {
            addBtn.disabled = false;
            addBtn.classList.remove('is-sold-out');
            if (addText) addText.textContent = addBtn.getAttribute('data-add-label') || 'Add to Cart';
          } else {
            addBtn.disabled = true;
            addBtn.classList.add('is-sold-out');
            if (addText) addText.textContent = 'Sold Out';
          }
        }

        /* Update featured image if variant has one */
        if (matched.featured_image && matched.featured_image.src) {
          var mainImg = document.getElementById('main-product-image');
          if (mainImg) {
            var src = matched.featured_image.src.replace(/(\.[^.]+)$/, '_1200x$1');
            mainImg.src = src;
          }
        }
      }
    },

    /** AJAX add-to-cart */
    initAddToCart: function (form) {
      var addBtn = form.querySelector('[data-add-to-cart]');
      if (!addBtn) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var variantInput = form.querySelector('[data-variant-id-input]') || form.querySelector('[name="id"]');
        if (!variantInput || !variantInput.value) return;

        var qtyInput = form.querySelector('[data-qty-input]') || form.querySelector('[name="quantity"]');
        var quantity = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

        addBtn.disabled = true;
        var textEl = addBtn.querySelector('[data-add-text]');
        var originalText = addBtn.getAttribute('data-add-label') || 'Add to Cart';
        if (textEl) textEl.textContent = 'Adding...';

        Cart.add(parseInt(variantInput.value, 10), quantity).then(function () {
          addBtn.classList.add('is-added');
          if (textEl) textEl.textContent = 'Added';

          /* Open cart drawer */
          CartDrawer.open();

          /* Also try to open Shopify native cart drawer */
          var nativeDrawer = document.querySelector('cart-drawer');
          if (nativeDrawer && typeof nativeDrawer.open === 'function') {
            nativeDrawer.open();
          }

          setTimeout(function () {
            addBtn.classList.remove('is-added');
            addBtn.disabled = false;
            if (textEl) textEl.textContent = originalText;
          }, 2000);
        }).catch(function (err) {
          console.warn('Add to cart failed:', err);
          addBtn.disabled = false;
          if (textEl) textEl.textContent = originalText;
        });
      });
    },

    /** Thumbnail gallery */
    initGallery: function () {
      var mainImg = document.getElementById('main-product-image');
      var thumbs = document.querySelectorAll('[data-product-thumb]');
      if (thumbs.length === 0) return;

      thumbs.forEach(function (thumb, idx) {
        thumb.addEventListener('click', function () {
          var mediaType = thumb.getAttribute('data-media-type');
          var src = thumb.getAttribute('data-full-src');
          var alt = thumb.getAttribute('data-alt') || '';
          var mediaSrc = thumb.getAttribute('data-media-src');

          var mediaMain = document.getElementById('product-main-media');
          if (mediaMain) {
            if (mediaType === 'video') {
              mediaMain.innerHTML =
                '<video src="' + mediaSrc + '" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;filter:brightness(0.92)"></video>';
            } else if (src) {
              /* Replace or update existing image */
              var existingImg = mediaMain.querySelector('img');
              if (existingImg) {
                existingImg.src = src;
                existingImg.alt = alt;
              } else {
                mediaMain.innerHTML = '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.92)" id="main-product-image">';
              }
            }
          } else if (mainImg && src) {
            mainImg.src = src;
            mainImg.alt = alt;
          }

          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
          ProductPage.currentMediaIndex = idx;
        });
      });

      /* Store for carousel */
      ProductPage.mediaItems = Array.from(thumbs);
    },

    /** Carousel prev/next arrows */
    initCarousel: function () {
      var prevBtn = document.querySelector('[data-carousel-prev]');
      var nextBtn = document.querySelector('[data-carousel-next]');
      if (!prevBtn && !nextBtn) return;

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          var items = ProductPage.mediaItems;
          if (items.length === 0) return;
          var idx = ProductPage.currentMediaIndex - 1;
          if (idx < 0) idx = items.length - 1;
          if (items[idx]) items[idx].click();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          var items = ProductPage.mediaItems;
          if (items.length === 0) return;
          var idx = ProductPage.currentMediaIndex + 1;
          if (idx >= items.length) idx = 0;
          if (items[idx]) items[idx].click();
        });
      }
    },

    /** Quantity stepper on product page */
    initQuantityStepper: function () {
      var minus = document.querySelector('[data-qty-minus]');
      var plus  = document.querySelector('[data-qty-plus]');
      var input = document.querySelector('[data-qty-input]');
      if (!minus || !plus || !input) return;

      minus.addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 1;
        if (val > 1) input.value = val - 1;
      });
      plus.addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 1;
        input.value = val + 1;
      });
    }
  };

  /* =========================================================================
     Newsletter Form — AJAX submit
     ========================================================================= */

  var Newsletter = {
    init: function () {
      var forms = document.querySelectorAll('[data-newsletter-form]');
      forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();

          var emailInput = form.querySelector('input[type="email"]');
          var submitBtn  = form.querySelector('button[type="submit"]');
          var msgEl      = form.querySelector('[data-newsletter-message]');
          if (!emailInput || !emailInput.value) return;

          if (submitBtn) submitBtn.disabled = true;

          fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString()
          }).then(function (res) {
            emailInput.value = '';
            if (msgEl) {
              msgEl.textContent = res.ok ? 'Welcome to the void.' : 'Something went wrong. Try again.';
              msgEl.classList.add('is-visible');
              if (!res.ok) msgEl.classList.add('is-error');
            }
          }).catch(function () {
            if (msgEl) {
              msgEl.textContent = 'Something went wrong. Try again.';
              msgEl.classList.add('is-visible', 'is-error');
            }
          }).finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
        });
      });
    }
  };

  /* =========================================================================
     Scroll Animations — IntersectionObserver
     ========================================================================= */

  var ScrollReveal = {
    init: function () {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      els.forEach(function (el) { observer.observe(el); });
    }
  };

  /* =========================================================================
     Collection Page — filter interactions
     ========================================================================= */

  var CollectionFilters = {
    init: function () {
      var filterBtns = document.querySelectorAll('[data-filter-btn]');
      if (filterBtns.length === 0) return;

      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var group = btn.closest('[data-filter-group]');
          if (group) {
            group.querySelectorAll('[data-filter-btn]').forEach(function (b) {
              b.classList.remove('is-active');
            });
          }
          btn.classList.add('is-active');
          var url = btn.getAttribute('data-filter-url');
          if (url) window.location.href = url;
        });
      });
    }
  };

  /* =========================================================================
     Quantity Selector (cart page)
     ========================================================================= */

  var QuantitySelector = {
    init: function () {
      document.querySelectorAll('[data-qty-selector]').forEach(function (wrapper) {
        var minus = wrapper.querySelector('[data-qty-minus]');
        var plus  = wrapper.querySelector('[data-qty-plus]');
        var input = wrapper.querySelector('[data-qty-input]');
        var key   = wrapper.getAttribute('data-line-key');
        if (!minus || !plus || !input || !key) return;

        minus.addEventListener('click', function () {
          var val = parseInt(input.value, 10);
          if (val > 1) Cart.update(key, val - 1);
        });
        plus.addEventListener('click', function () {
          var val = parseInt(input.value, 10);
          Cart.update(key, val + 1);
        });
      });

      /* Remove buttons on cart page */
      document.querySelectorAll('[data-cart-page-remove]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-cart-page-remove');
          Cart.remove(key).then(function () {
            window.location.reload();
          });
        });
      });
    }
  };

  /* =========================================================================
     Settings Page — volume + notifications localStorage
     ========================================================================= */

  var SettingsPage = {
    init: function () {
      var volSlider   = document.getElementById('obl-volume');
      var volVal      = document.getElementById('obl-volume-val');
      var notifToggle = document.getElementById('obl-notifications');
      if (!volSlider && !notifToggle) return;

      var savedVol   = localStorage.getItem('obl_volume');
      var savedNotif = localStorage.getItem('obl_notifications');

      if (volSlider) {
        if (savedVol !== null) {
          volSlider.value = savedVol;
          if (volVal) volVal.textContent = savedVol;
        }
        volSlider.addEventListener('input', function () {
          var v = volSlider.value;
          if (volVal) volVal.textContent = v;
          localStorage.setItem('obl_volume', v);
        });
      }

      if (notifToggle) {
        if (savedNotif === 'true') notifToggle.checked = true;
        notifToggle.addEventListener('change', function () {
          localStorage.setItem('obl_notifications', notifToggle.checked ? 'true' : 'false');
        });
      }
    }
  };

  /* =========================================================================
     Search
     ========================================================================= */

  var Search = {
    init: function () {
      /* Placeholder for future live search implementation */
    }
  };

  /* =========================================================================
     Init — run on DOMContentLoaded
     ========================================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    CartDrawer.init();
    MobileMenu.init();
    ProductPage.init();
    Newsletter.init();
    ScrollReveal.init();
    CollectionFilters.init();
    QuantitySelector.init();
    SettingsPage.init();
    Search.init();
  });

})();
