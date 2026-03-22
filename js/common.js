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

  /* --- Mobile full-screen nav --- */
  var mobileNav = document.querySelector('.mobile-nav');
  var overlay = document.querySelector('.nav-overlay');
  var mobileNavOpen = false;

  function openMobileMenu() {
    if (mobileNavOpen || !mobileNav) return;
    mobileNavOpen = true;
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNavOpen || !mobileNav) return;
    mobileNavOpen = false;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileNavOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  // Close on overlay tap
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // Close on X button
  if (mobileNav) {
    var closeBtn = mobileNav.querySelector('.mobile-nav-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNavOpen) {
      closeMobileMenu();
      if (toggle) toggle.focus();
    }
  });

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
