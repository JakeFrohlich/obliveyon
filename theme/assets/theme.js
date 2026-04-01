/**
 * Obliveyon Theme — vanilla JS
 * Cart (Shopify AJAX API), mobile menu, product page, newsletter, scroll animations
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

    /** Update the header cart badge */
    updateBadge: function () {
      var badges = document.querySelectorAll('[data-cart-count]');
      var count = Cart.state ? Cart.state.item_count : 0;
      badges.forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';
      });
    },

    /** Render cart drawer contents */
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
              '<img src="' + Cart.imageSize(item.image, '160x') + '" alt="' + Cart.escape(item.title) + '" loading="lazy">' +
            '</div>' +
            '<div class="cart-drawer__item-details">' +
              '<h3 class="cart-drawer__item-title">' + Cart.escape(item.product_title) + '</h3>' +
              (item.variant_title ? '<p class="cart-drawer__item-variant">' + Cart.escape(item.variant_title) + '</p>' : '') +
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
          Cart.update(key, qty);
        });
      });
      document.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = this.getAttribute('data-cart-remove');
          Cart.remove(key);
        });
      });
    },

    /** Resize Shopify CDN image */
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
     Cart Drawer — open / close
     ========================================================================= */

  var CartDrawer = {
    drawer: null,
    overlay: null,

    init: function () {
      CartDrawer.drawer = document.querySelector('[data-cart-drawer]');
      CartDrawer.overlay = document.querySelector('[data-cart-overlay]');
      if (!CartDrawer.drawer) return;

      /* Open buttons */
      document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          CartDrawer.open();
        });
      });

      /* Close button */
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
        if (e.key === 'Escape' && CartDrawer.drawer.classList.contains('is-open')) {
          CartDrawer.close();
        }
      });

      /* Initial cart fetch */
      Cart.fetch();
    },

    open: function () {
      if (!CartDrawer.drawer) return;
      CartDrawer.drawer.classList.add('is-open');
      if (CartDrawer.overlay) CartDrawer.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      if (!CartDrawer.drawer) return;
      CartDrawer.drawer.classList.remove('is-open');
      if (CartDrawer.overlay) CartDrawer.overlay.classList.remove('is-open');
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

      /* Close on link click */
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
     Product Page — size selector, variant-aware add-to-cart, image gallery
     ========================================================================= */

  var ProductPage = {
    init: function () {
      var form = document.querySelector('[data-product-form]');
      if (!form) return;

      ProductPage.initSizeSelector(form);
      ProductPage.initAddToCart(form);
      ProductPage.initGallery();
    },

    /** Size / variant selector buttons */
    initSizeSelector: function (form) {
      var buttons = form.querySelectorAll('[data-size-btn]');
      var variantInput = form.querySelector('[name="id"]');
      var sizeDisplay = form.querySelector('[data-selected-size]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          /* Deselect all */
          buttons.forEach(function (b) { b.classList.remove('is-selected'); });
          /* Select clicked */
          btn.classList.add('is-selected');

          /* Update hidden variant id */
          var variantId = btn.getAttribute('data-variant-id');
          if (variantInput && variantId) {
            variantInput.value = variantId;
          }

          /* Update size display */
          if (sizeDisplay) {
            sizeDisplay.textContent = btn.textContent.trim();
          }

          /* Enable add-to-cart button */
          var addBtn = form.querySelector('[data-add-to-cart]');
          if (addBtn && !addBtn.hasAttribute('data-sold-out')) {
            addBtn.disabled = false;
            addBtn.querySelector('[data-add-text]').textContent = addBtn.getAttribute('data-add-label') || 'Add to Cart';
          }
        });
      });
    },

    /** AJAX add-to-cart with 3-state feedback */
    initAddToCart: function (form) {
      var addBtn = form.querySelector('[data-add-to-cart]');
      if (!addBtn) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var variantId = form.querySelector('[name="id"]');
        if (!variantId || !variantId.value) return;

        addBtn.disabled = true;
        var textEl = addBtn.querySelector('[data-add-text]');
        var originalText = addBtn.getAttribute('data-add-label') || 'Add to Cart';

        Cart.add(parseInt(variantId.value, 10), 1).then(function () {
          /* Success state */
          addBtn.classList.add('is-added');
          if (textEl) textEl.textContent = 'Added to Cart';

          /* Open cart drawer */
          CartDrawer.open();

          /* Reset after 2s */
          setTimeout(function () {
            addBtn.classList.remove('is-added');
            addBtn.disabled = false;
            if (textEl) textEl.textContent = originalText;
          }, 2000);
        }).catch(function () {
          addBtn.disabled = false;
          if (textEl) textEl.textContent = originalText;
        });
      });
    },

    /** Image gallery — thumbnail click swaps main image */
    initGallery: function () {
      var main = document.querySelector('[data-product-main-image]');
      var thumbs = document.querySelectorAll('[data-product-thumb]');
      if (!main || thumbs.length === 0) return;

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var src = thumb.getAttribute('data-full-src');
          var alt = thumb.getAttribute('data-alt') || '';
          if (src) {
            main.src = src;
            main.alt = alt;
          }
          /* Update active state */
          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
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
          var submitBtn = form.querySelector('button[type="submit"]');
          var msgEl = form.querySelector('[data-newsletter-message]');
          if (!emailInput || !emailInput.value) return;

          /* Disable while submitting */
          if (submitBtn) submitBtn.disabled = true;

          fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString()
          }).then(function (res) {
            if (res.ok || res.status === 200) {
              emailInput.value = '';
              if (msgEl) {
                msgEl.textContent = 'Welcome to the void.';
                msgEl.classList.add('is-visible');
              }
            } else {
              if (msgEl) {
                msgEl.textContent = 'Something went wrong. Try again.';
                msgEl.classList.add('is-visible', 'is-error');
              }
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
     Scroll Animations — IntersectionObserver (replaces framer-motion)
     ========================================================================= */

  var ScrollReveal = {
    init: function () {
      if (!('IntersectionObserver' in window)) {
        /* Fallback: show everything */
        document.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.add('is-visible');
        });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      });

      document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
      });
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

          /* Navigate with filter params */
          var url = btn.getAttribute('data-filter-url');
          if (url) {
            window.location.href = url;
          }
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
        var plus = wrapper.querySelector('[data-qty-plus]');
        var input = wrapper.querySelector('[data-qty-input]');
        var key = wrapper.getAttribute('data-line-key');

        if (!minus || !plus || !input || !key) return;

        minus.addEventListener('click', function () {
          var val = parseInt(input.value, 10);
          if (val > 1) {
            Cart.update(key, val - 1);
          }
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
     Search
     ========================================================================= */

  var Search = {
    init: function () {
      var form = document.querySelector('[data-search-form]');
      if (!form) return;

      /* Live search could be added here */
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
    Search.init();
  });

})();
