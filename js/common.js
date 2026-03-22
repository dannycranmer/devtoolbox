/* === DevBrew — Shared Utilities === */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.querySelector('.nav');
  var VISIBLE_DESKTOP = 6;

  /* --- Desktop "More" mega-dropdown --- */
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
    moreBtn.innerHTML = 'All Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-left:2px"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

    document.addEventListener('click', function () {
      moreLi.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* --- Mobile full-screen categorized nav (generated from JS) --- */
  function initMobileNav() {
    if (!nav || !toggle) return;

    // Replace hamburger content with animated bars
    toggle.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      var bar = document.createElement('span');
      bar.className = 'hamburger-bar';
      toggle.appendChild(bar);
    }

    var currentPage = location.pathname.split('/').pop() || 'index.html';

    var categories = [
      { title: '\uD83D\uDD27 Formatters', items: [
        { href: 'json-formatter.html', icon: '{ }', label: 'JSON' },
        { href: 'sql-formatter.html', icon: '\uD83D\uDDC3\uFE0F', label: 'SQL' },
        { href: 'yaml-formatter.html', icon: '\uD83D\uDCC4', label: 'YAML' },
        { href: 'css-minifier.html', icon: '\uD83C\uDFA8', label: 'CSS Minify' },
        { href: 'js-minifier.html', icon: '\u26A1', label: 'JS Minify' }
      ]},
      { title: '\uD83D\uDD10 Encoders', items: [
        { href: 'base64.html', icon: '\uD83D\uDD04', label: 'Base64' },
        { href: 'url-encoder.html', icon: '\uD83D\uDD17', label: 'URL Encode' },
        { href: 'jwt-decoder.html', icon: '\uD83D\uDD11', label: 'JWT Decode' },
        { href: 'hash-generator.html', icon: '#\uFE0F\u20E3', label: 'Hash' },
        { href: 'html-entity.html', icon: '\uD83C\uDFF7\uFE0F', label: 'HTML Entity' }
      ]},
      { title: '\uD83C\uDFA8 Generators', items: [
        { href: 'uuid-generator.html', icon: '\uD83C\uDD94', label: 'UUID' },
        { href: 'lorem-ipsum.html', icon: '\uD83D\uDCDC', label: 'Lorem Ipsum' },
        { href: 'password-generator.html', icon: '\uD83D\uDD12', label: 'Password' },
        { href: 'color-picker.html', icon: '\uD83C\uDF08', label: 'Color Picker' },
        { href: 'favicon-generator.html', icon: '\u2B50', label: 'Favicon' },
        { href: 'gradient-generator.html', icon: '\uD83C\uDF1F', label: 'Gradient' },
        { href: 'og-generator.html', icon: '\uD83D\uDCE2', label: 'OG Meta' },
        { href: 'chart-generator.html', icon: '\uD83D\uDCC8', label: 'Charts' }
      ]},
      { title: '\uD83D\uDD04 Converters', items: [
        { href: 'markdown.html', icon: '\u270D\uFE0F', label: 'Markdown' },
        { href: 'timestamp.html', icon: '\uD83D\uDD51', label: 'Timestamp' },
        { href: 'cron-parser.html', icon: '\u23F0', label: 'Cron Parse' },
        { href: 'cron-builder.html', icon: '\uD83D\uDD52', label: 'Cron Build' },
        { href: 'csv-viewer.html', icon: '\uD83D\uDCCA', label: 'CSV Viewer' },
        { href: 'svg-optimizer.html', icon: '\uD83D\uDDBC\uFE0F', label: 'SVG Optimize' }
      ]},
      { title: '\uD83D\uDCDD Text Tools', items: [
        { href: 'regex-tester.html', icon: '.*', label: 'Regex Test' },
        { href: 'diff-checker.html', icon: '\uD83D\uDD0D', label: 'Diff Check' }
      ]}
    ];

    // Build sections HTML
    var sectionsHTML = categories.map(function (cat) {
      var itemsHTML = cat.items.map(function (item) {
        var active = (currentPage === item.href) ? ' active' : '';
        return '<a href="' + item.href + '" class="mobile-nav-item' + active + '">' +
          '<span class="mobile-nav-icon">' + item.icon + '</span>' +
          '<span class="mobile-nav-label">' + item.label + '</span></a>';
      }).join('');
      return '<div class="mobile-nav-section"><div class="mobile-nav-section-title">' +
        cat.title + '</div><div class="mobile-nav-grid">' + itemsHTML + '</div></div>';
    }).join('');

    var homeActive = (currentPage === 'index.html' || currentPage === '') ? ' active' : '';

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';

    // Create mobile nav
    var mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.innerHTML =
      '<div class="mobile-nav-header">' +
        '<a href="index.html" class="mobile-nav-brand">Dev<span>Brew</span></a>' +
        '<button class="mobile-nav-close" aria-label="Close menu">\u2715</button>' +
      '</div>' +
      '<a href="index.html" class="mobile-nav-home' + homeActive + '">\uD83C\uDFE0 All Tools</a>' +
      sectionsHTML +
      '<a href="https://buymeacoffee.com/dairylea" class="mobile-nav-coffee" target="_blank" rel="noopener">\u2615 Buy Me a Coffee</a>' +
      '<div class="mobile-nav-privacy">\uD83D\uDD12 100% Private \u00B7 All processing in your browser</div>';

    // Insert after the nav element
    nav.after(overlay);
    overlay.after(mobileNav);

    // Toggle state
    var isOpen = false;

    function openNav() {
      if (isOpen) return;
      isOpen = true;
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (!isOpen) return;
      isOpen = false;
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      isOpen ? closeNav() : openNav();
    });
    overlay.addEventListener('click', closeNav);
    mobileNav.querySelector('.mobile-nav-close').addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeNav();
        toggle.focus();
      }
    });
  }

  // Init
  buildMoreDropdown();
  initMobileNav();

  /* --- Copy to clipboard --- */
  window.copyToClipboard = function (text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 1500);
      }
    }).catch(function () {
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
