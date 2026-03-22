/* === DevBrew — Shared Utilities === */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.querySelector('.nav');
  var MOBILE_BP = 1200;
  var VISIBLE_DESKTOP = 8;

  /* --- Desktop "More" dropdown --- */
  function buildMoreDropdown() {
    if (document.querySelector('.nav-more')) return;
    if (!navLinks) return;

    var items = Array.from(navLinks.querySelectorAll(':scope > li'));
    var coffeeItem = null;
    var toolItems = [];
    items.forEach(function (li) {
      if (li.querySelector('.nav-coffee')) coffeeItem = li;
      else toolItems.push(li);
    });

    if (toolItems.length <= VISIBLE_DESKTOP) return;

    var overflowItems = toolItems.slice(VISIBLE_DESKTOP);
    var moreLi = document.createElement('li');
    moreLi.className = 'nav-more';
    var moreBtn = document.createElement('button');
    moreBtn.className = 'nav-more-btn';
    moreBtn.textContent = 'More \u25BE';
    moreBtn.setAttribute('aria-expanded', 'false');
    moreLi.appendChild(moreBtn);

    var moreDropdown = document.createElement('ul');
    moreDropdown.className = 'nav-more-dropdown';
    var hasActive = false;
    overflowItems.forEach(function (li) {
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
      moreBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close More on outside click
    document.addEventListener('click', function () {
      moreLi.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* --- Mobile menu open / close --- */
  function openMobileMenu() {
    if (!navLinks || !toggle) return;
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!navLinks || !toggle) return;
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && navLinks) {
    // Hamburger toggle — use click (works on both desktop and mobile)
    // The viewport meta tag ensures no 300ms click delay on mobile
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when a link is clicked
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
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
  }

  // Build desktop More dropdown (only affects desktop via CSS)
  buildMoreDropdown();

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
