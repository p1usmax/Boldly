// ===== Boldly — content.js =====
// Finds readable text on the page and bolds the start of each word.
// Works in Chrome, Brave, Edge and Firefox (uses the `chrome.*` namespace).

(() => {
  'use strict';

  // Don't run twice in the same frame (e.g. extension reloaded).
  if (window.__boldlyLoaded) return;
  window.__boldlyLoaded = true;

  const WRAP = 'boldly-w'; // wraps a processed text node
  const BOLD = 'boldly-b'; // the bold part
  // Custom (hyphenated) tag names: site CSS like `span {display:block}`
  // or `b {font-weight:normal}` can't accidentally target them.

  const DEFAULTS = {
    enabled: true,
    boldPercent: 0.5,
    blockedSites: []
  };
  const MIN_WORD_LENGTH = 3;
  const MIN_BOLD_CHARS = 1;

  // Words = runs of Latin / Cyrillic / Greek letters (+ inner apostrophes).
  // Digits, punctuation and other scripts are left alone. Arabic, Hebrew,
  // Indic and CJK are skipped on purpose: splitting a cursive word into two
  // styled pieces breaks letter joining.
  const L = '[\\p{Script=Latin}\\p{Script=Cyrillic}\\p{Script=Greek}\\p{M}]';
  const WORD_RE = new RegExp(`${L}+(?:['\u2019]${L}+)*`, 'gu');
  const MARK_RE = /^\p{M}$/u;

  // Anything inside these is never touched (checked with closest()).
  const SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'template', 'textarea', 'input', 'select',
    'option', 'pre', 'code', 'kbd', 'samp', 'var', 'svg', 'canvas', 'math',
    'iframe', 'object', 'head', 'title', WRAP,
    '[contenteditable]:not([contenteditable="false"])'
  ].join(',');

  let settings = { ...DEFAULTS };
  let running = false;
  let observer = null;
  let queue = [];
  let qi = 0;
  let scheduled = false;

  // ---------- helpers ----------
  const normHost = (h) => h.replace(/^www\./, '');

  function isBlocked() {
    const host = normHost(location.hostname);
    return settings.blockedSites.some((s) => normHost(s) === host);
  }

  function shouldRun() {
    return settings.enabled && !isBlocked();
  }

  function skipText(node) {
    if (node.nodeValue.length < MIN_WORD_LENGTH) return true;
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.isContentEditable) return true;
    if (parent.closest(SKIP_SELECTOR)) return true;
    return false;
  }

  // ---------- core transform (builds real DOM nodes, never innerHTML) ----------
  function boldLengthFor(word) {
    let n = Math.ceil(word.length * settings.boldPercent);
    n = Math.max(n, MIN_BOLD_CHARS);
    n = Math.min(n, word.length);
    // Never split a letter from its combining mark.
    while (n < word.length && MARK_RE.test(word[n])) n++;
    return n;
  }

  function buildFragment(text) {
    const wrap = document.createElement(WRAP);
    let last = 0;
    let changed = false;

    for (const m of text.matchAll(WORD_RE)) {
      const word = m[0];
      if (word.length < MIN_WORD_LENGTH) continue;

      if (m.index > last) wrap.appendChild(document.createTextNode(text.slice(last, m.index)));

      const n = boldLengthFor(word);
      const b = document.createElement(BOLD);
      b.textContent = word.slice(0, n);
      wrap.appendChild(b);
      if (n < word.length) wrap.appendChild(document.createTextNode(word.slice(n)));

      last = m.index + word.length;
      changed = true;
    }

    if (!changed) return null;
    if (last < text.length) wrap.appendChild(document.createTextNode(text.slice(last)));
    return wrap;
  }

  function processTextNode(node) {
    if (!node.isConnected || skipText(node)) return;
    const wrap = buildFragment(node.nodeValue);
    if (wrap) node.replaceWith(wrap);
  }

  // ---------- queue (time-sliced so big pages don't freeze) ----------
  function collect(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      queue.push(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.localName === WRAP || root.localName === BOLD) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) queue.push(n);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    const run = () => { scheduled = false; pump(); };
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 200 });
    else setTimeout(run, 16);
  }

  function pump() {
    if (!running) return;
    const t0 = performance.now();
    while (qi < queue.length && performance.now() - t0 < 12) {
      processTextNode(queue[qi++]);
    }
    if (qi < queue.length) {
      schedule();
    } else {
      queue = [];
      qi = 0;
    }
  }

  function enqueue(root) {
    collect(root);
    schedule();
  }

  // ---------- start / stop ----------
  function start() {
    if (running || !document.body) return;
    running = true;

    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) enqueue(node);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    enqueue(document.body);
  }

  function stop() {
    running = false;
    if (observer) { observer.disconnect(); observer = null; }
    queue = [];
    qi = 0;

    // Undo everything we changed.
    if (document.body) {
      document.body.querySelectorAll(WRAP).forEach((w) => {
        w.replaceWith(document.createTextNode(w.textContent));
      });
      document.body.normalize();
    }
  }

  function apply() {
    stop();
    if (shouldRun()) start();
  }

  // ---------- settings ----------
  function load(cb) {
    chrome.storage.local.get(DEFAULTS, (s) => {
      settings = { ...DEFAULTS, ...s };
      cb && cb();
    });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') load(apply);
  });

  load(apply);
})();
