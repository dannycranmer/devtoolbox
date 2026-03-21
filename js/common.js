/* === DevToolbox — Shared Utilities === */

(function () {
  'use strict';

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    // Close menu when a link is clicked
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- "More" dropdown for nav overflow --- */
  (function () {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    var items = Array.from(navLinks.children);
    var VISIBLE = 8;
    var coffeeItem = null;
    var toolItems = [];
    items.forEach(function (li) {
      if (li.querySelector('.nav-coffee')) coffeeItem = li;
      else toolItems.push(li);
    });
    if (toolItems.length <= VISIBLE) return;
    var overflow = toolItems.slice(VISIBLE);
    var moreLi = document.createElement('li');
    moreLi.className = 'nav-more';
    var btn = document.createElement('button');
    btn.className = 'nav-more-btn';
    btn.textContent = 'More \u25BE';
    btn.setAttribute('aria-expanded', 'false');
    moreLi.appendChild(btn);
    var dd = document.createElement('ul');
    dd.className = 'nav-more-dropdown';
    var hasActive = false;
    overflow.forEach(function (li) {
      navLinks.removeChild(li);
      if (li.querySelector('.active')) hasActive = true;
      dd.appendChild(li);
    });
    moreLi.appendChild(dd);
    if (hasActive) moreLi.classList.add('has-active');
    if (coffeeItem) navLinks.insertBefore(moreLi, coffeeItem);
    else navLinks.appendChild(moreLi);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = moreLi.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function () {
      moreLi.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  })();

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
