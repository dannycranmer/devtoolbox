/* === DevToolbox — Shared Utilities === */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.querySelector('.nav');
  var MOBILE_BP = 1200;
  var VISIBLE_DESKTOP = 8;

  /* --- Detect mobile vs desktop --- */
  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  /* --- Build / tear down the "More" dropdown (desktop only) --- */
  var moreLi = null;
  var moreDropdown = null;
  var moreBtn = null;
  var overflowItems = [];
  var originalOrder = []; // cache original <li> order

  function cacheOriginalOrder() {
    if (originalOrder.length) return;
    originalOrder = Array.from(navLinks.children).slice();
  }

  function restoreOriginalOrder() {
    // Put all items back into navLinks in original order
    originalOrder.forEach(function (li) {
      navLinks.appendChild(li);
    });
    // Remove the "More" <li> if it exists
    if (moreLi && moreLi.parentNode) {
      moreLi.parentNode.removeChild(moreLi);
    }
    moreLi = null;
    moreDropdown = null;
    moreBtn = null;
    overflowItems = [];
  }

  function buildMoreDropdown() {
    if (moreLi) return; // already built

    var items = Array.from(navLinks.children);
    var coffeeItem = null;
    var toolItems = [];
    items.forEach(function (li) {
      if (li.querySelector('.nav-coffee')) coffeeItem = li;
      else toolItems.push(li);
    });

    if (toolItems.length <= VISIBLE_DESKTOP) return;

    overflowItems = toolItems.slice(VISIBLE_DESKTOP);
    moreLi = document.createElement('li');
    moreLi.className = 'nav-more';
    moreBtn = document.createElement('button');
    moreBtn.className = 'nav-more-btn';
    moreBtn.textContent = 'More \u25BE';
    moreBtn.setAttribute('aria-expanded', 'false');
    moreLi.appendChild(moreBtn);

    moreDropdown = document.createElement('ul');
    moreDropdown.className = 'nav-more-dropdown';
    var hasActive = false;
    overflowItems.forEach(function (li) {
      navLinks.removeChild(li);
      if (li.querySelector('.active')) hasActive = true;
      moreDropdown.appendChild(li);
    });
    moreLi.appendChild(moreDropdown);
    if (hasActive) moreLi.classList.add('has-active');

    if (coffeeItem) navLinks.insertBefore(moreLi, coffeeItem);
    else navLinks.appendChild(moreLi);

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = moreLi.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  /* --- Close "More" on outside click --- */
  document.addEventListener('click', function () {
    if (moreLi) {
      moreLi.classList.remove('open');
      if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* --- Handle layout changes --- */
  var currentMode = null;

  function applyLayout() {
    var mobile = isMobile();
    var mode = mobile ? 'mobile' : 'desktop';
    if (mode === currentMode) return;
    currentMode = mode;

    if (mobile) {
      // Restore all items flat for mobile
      restoreOriginalOrder();
    } else {
      // Restore first (in case switching from mobile), then build More
      restoreOriginalOrder();
      buildMoreDropdown();
      // Close mobile menu if it was open
      closeMobileMenu();
    }
  }

  /* --- Mobile menu open / close --- */
  function openMobileMenu() {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && navLinks) {
    // Cache original order before any DOM manipulation
    cacheOriginalOrder();

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when a link is clicked
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside nav on mobile
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Apply correct layout on load and resize
    applyLayout();
    window.addEventListener('resize', applyLayout);
  }

  /* --- Copy to clipboard --- */
  window.copyToClipboard = function (text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 1500);
      }
    }).catch(function () {
      // Fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 1500);
      }
    });
  };

  /* --- Show message --- */
  window.showMsg = function (el, type, text) {
    el.className = 'msg show msg-' + type;
    el.textContent = text;
  };

  window.hideMsg = function (el) {
    el.className = 'msg';
    el.textContent = '';
  };

  /* --- Ctrl+Enter shortcut --- */
  window.bindCtrlEnter = function (callback) {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        callback();
      }
    });
  };

  /* --- Escape HTML --- */
  window.escapeHtml = function (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /* --- Format bytes --- */
  window.formatBytes = function (bytes) {
    if (bytes === 0) return '0 B';
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
  };

})();
